import React, { useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Hands } from "@mediapipe/hands";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

export default function LiveFeedbackTracker() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    let faceData: any = null;
    let handData: any = null;
    let poseData: any = null;
    let lastLogTime = 0;

    /** 카메라 권한 요청 */
    async function initCamera() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("📸 Camera permission granted!");
      } catch (err) {
        console.error("❌ Camera permission denied!", err);
        return;
      }

      startMediapipe();
    }

    /** Mediapipe 초기화 및 카메라 시작 */
    function startMediapipe() {
      /** FaceMesh */
      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      faceMesh.onResults((results) => {
        faceData = results;
      });

      /** Hands */
      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      hands.onResults((results) => {
        handData = results;
      });

      /** Pose */
      const pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      pose.onResults((results) => {
        poseData = results;
      });

      /** Camera */
      const camera = new Camera(videoRef.current!, {
        onFrame: async () => {
          const image = videoRef.current!;
          await faceMesh.send({ image });
          await hands.send({ image });
          await pose.send({ image });

          printCombinedResults();
        },
        width: 640,
        height: 480,
      });

      camera.start();
    }

    /** 1초마다 주요 값만 콘솔 출력 */
    function printCombinedResults() {
      const now = Date.now();
      if (now - lastLogTime < 1000) return; // 1초 제한
      lastLogTime = now;

      const output: any = {
        gaze: "unknown",
        headTilt: null,
        pinch: false,
        shoulderTilt: null,
        face: null,
        hand: null,
        shoulder: null,
      };

      /** FaceMesh */
      if (
        faceData?.multiFaceLandmarks &&
        faceData.multiFaceLandmarks.length > 0
      ) {
        const face = faceData.multiFaceLandmarks[0];
        const leftEye = face[33];
        const rightEye = face[263];

        // 시선 방향
        const gazeDelta = rightEye.x - leftEye.x;
        let gaze = "center";
        if (gazeDelta > 0.02) gaze = "right";
        else if (gazeDelta < -0.02) gaze = "left";

        // 고개 기울기
        const headTilt = face[234].y - face[454].y;

        output.gaze = gaze;
        output.headTilt = Number(headTilt.toFixed(3));
        output.face = {
          leftEye: { x: leftEye.x, y: leftEye.y },
          rightEye: { x: rightEye.x, y: rightEye.y },
        };
      }

      /** Hands */
      if (handData?.multiHandLandmarks) {
        const firstHand = handData.multiHandLandmarks[0];
        if (firstHand) {
          const thumb = firstHand[4];
          const index = firstHand[8];

          const dx = thumb.x - index.x;
          const dy = thumb.y - index.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 0.03) output.pinch = true;

          output.hand = {
            thumbTip: { x: thumb.x, y: thumb.y },
            indexTip: { x: index.x, y: index.y },
          };
        }
      }

      /** Pose */
      if (poseData?.poseLandmarks) {
        const ls = poseData.poseLandmarks[11];
        const rs = poseData.poseLandmarks[12];

        const shoulderTilt = ls.y - rs.y;

        output.shoulderTilt = Number(shoulderTilt.toFixed(3));
        output.shoulder = {
          left: { x: ls.x, y: ls.y },
          right: { x: rs.x, y: rs.y },
        };
      }

      /** 최종 콘솔 출력 */
      console.log("📦 Combined (every 1s):", output);
    }

    /** 실행 시작 */
    initCamera();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ width: 0, height: 0, opacity: 0, position: "absolute" }}
    />
  );
}
