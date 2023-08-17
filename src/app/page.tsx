"use client";
import { useRef, useEffect, useCallback, MutableRefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import pageStyles from "./page.module.css";
import gsap from "gsap";

import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ReactCanvasConfetti from "react-canvas-confetti";

const letter = `れなぴょんへ

一緒に働けた期間は１年ちょっとくらいかな？
いつも一生懸命で仕事の飲み込みも早かったよね。

あの時は照れ臭くて言えなかったけど、
シフトが一緒だったときは心なしかウキウキしてる自分がいました。

イケメンで仕事ができるれなぴょん。
憂菜さんの前では気持ち悪いくらい甘える人であって欲しい。

じゅんぴより`;

const Model = () => {
  const gltf = useLoader(GLTFLoader, "/scene.gltf");
  return (
    <>
      <primitive object={gltf.scene} scale={0.01} />
    </>
  );
};

export default function Home() {
  const textMaskContainerRef = useRef(null);
  const confettiTriggerContainerRef = useRef(null);
  const stickyMaskRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const textRefs = useRef([]);

  const initialMaskSize = 0.8;
  const targetMaskSize = 30;
  const easing = 0.15;
  let easedScrollProgress = 0;

  let textAnimationRefs = useRef<HTMLSpanElement[]>([]);
  const textContainerRef = useRef(null);
  const textAnimationContainerRef: MutableRefObject<HTMLDivElement | null> =
    useRef(null);

  const confettiAnimationInstance: MutableRefObject<
    ((opts: any) => void) | null
  > = useRef(null);

  const getConfettiInstance = useCallback((instance: any) => {
    confettiAnimationInstance.current = instance;
  }, []);

  const launchConfetti = useCallback((particleRatio: number, opts: any) => {
    confettiAnimationInstance.current &&
      confettiAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fireConfetti = () => {
    launchConfetti(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    launchConfetti(0.2, {
      spread: 60,
    });

    launchConfetti(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    launchConfetti(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    launchConfetti(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  useEffect(() => {
    requestAnimationFrame(animateMask);
  }, []);

  const animateMask = () => {
    if (stickyMaskRef.current) {
      const maskSizeProgress = targetMaskSize * getScrollProgress();
      stickyMaskRef.current.style.webkitMaskSize =
        (initialMaskSize + maskSizeProgress) * 100 + "%";
      requestAnimationFrame(animateMask);
    }
  };

  const getScrollProgress = () => {
    if (stickyMaskRef.current && textAnimationContainerRef.current) {
      const scrollProgress =
        stickyMaskRef.current.offsetTop /
        (textAnimationContainerRef.current.getBoundingClientRect().height -
          window.innerHeight);
      const delta = scrollProgress - easedScrollProgress;
      easedScrollProgress += delta * easing;
      return easedScrollProgress;
    }
    return 0;
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    animateTextAppearance();
    animateConfettiTrigger();
  }, []);

  const animateTextAppearance = () => {
    gsap.to(textAnimationRefs.current, {
      scrollTrigger: {
        trigger: textAnimationContainerRef.current,
        scrub: true,
        start: "top",
        end: `+=${window.innerHeight / 0.8}`,
      },
      opacity: 1,
      ease: "none",
      stagger: 0.1,
    });
  };

  const animateConfettiTrigger = () => {
    gsap.to(textAnimationRefs.current, {
      scrollTrigger: {
        trigger: confettiTriggerContainerRef.current,
        onEnter: () => {
          fireConfetti();
        },
      },
    });
  };

  const splitWords = (phrase: string) => {
    let body: JSX.Element[] = [];
    phrase.split(" ").forEach((word, i) => {
      const letters = splitLetters(word);
      body.push(<p key={word + "_" + i}>{letters}</p>);
    });
    return body;
  };

  const splitLetters = (word: string) => {
    let letters: JSX.Element[] = [];
    word.split("").forEach((letter, i) => {
      if (letter === "\n") {
        letters.push(<br key={i} />);
      } else {
        letters.push(
          <span
            key={letter + "_" + i}
            ref={(el: HTMLSpanElement | null) => {
              if (el) {
                textAnimationRefs.current.push(el);
              }
            }}
          >
            {letter}
          </span>
        );
      }
    });
    return letters;
  };

  useEffect(() => {
    gsap.to(textRefs.current, {
      duration: 0.5,
      y: "0%",
      stagger: 0.05,
      ease: "power4.out",
    });
  }, []);

  return (
    <main ref={textAnimationContainerRef} className={pageStyles.main}>
      <div ref={textMaskContainerRef} className={pageStyles.textMaskContainer}>
        <div ref={stickyMaskRef} className={pageStyles.stickyMask}>
          <div ref={textContainerRef} className={pageStyles.textContainer}>
            {splitWords(letter)}
          </div>
        </div>
      </div>

      <div className={pageStyles.heartContainer}>
        <div className={pageStyles.topLeft}>Best wishes for a long</div>
        <div className={pageStyles.bottomRight}>and happy life together</div>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <spotLight
            intensity={0.5}
            angle={0.1}
            penumbra={1}
            position={[10, 15, 10]}
            castShadow
          />
          <Suspense fallback={null}>
            <Model />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls
            autoRotate
            enableZoom={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
        <ReactCanvasConfetti
          refConfetti={getConfettiInstance}
          style={{
            position: "absolute",
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            bottom: 0,
            left: 0,
          }}
        />
        <div
          ref={confettiTriggerContainerRef}
          style={{ position: "absolute", bottom: "0", height: "1px" }}
        />
      </div>
    </main>
  );
}
