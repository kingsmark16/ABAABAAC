import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/all'
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);


const Sample = () => {

    const scrollRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {

        const boxes = gsap.utils.toArray(
            scrollRef.current?.children || []
        );

        boxes.forEach((box) => {
            gsap.to(box as HTMLElement, {
                x: 150,
                rotation: 360,
                borderRadius: '100%',
                scale: 1.5,
                scrollTrigger: {
                    trigger: box as HTMLElement,
                    start: 'bottom bottom',
                    end: 'top 20%',
                    scrub: true,

                },
                ease: 'power1.inOut'
            })
        })

    }, [])

    useGSAP(() => {
        gsap.to('#box1', {
            x: 900,
            repeat: -1,
            rotation: 360,
            duration: 3,
            yoyo: true
        })
    })

    useGSAP(() => {
        gsap.to('#box2', {
            x: 900,
            duration: 3,
            repeat: -1,
            rotation: 360,
            yoyo: true
        })
    })

  return (
    <div className="w-full flex justify-center items-start gap-4 flex-col bg-amber-700">
        <div id="box1" className="w-20 h-20 bg-amber-200">

        </div>
        <div id="box2" className="w-20 h-20 bg-blue-500">

        </div>

        <div className="m-5 px-10 flex justify-between items-center flex-col gap-7">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum nesciunt, illum velit sapiente molestias maxime necessitatibus doloribus fugit fugiat nihil?</p>
            <div className="w-25 h-25 bg-white">

            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore libero ullam autem. Officia tenetur ipsam unde enim vitae perferendis quas, quia laudantium rem dicta! Sunt ab nulla maxime, est officiis repellendus vel explicabo quos eum. Tempore ipsam aliquid mollitia numquam pariatur eveniet ad animi accusamus alias quasi suscipit in molestiae odio, enim odit consequatur quas neque repellat porro aut rem. Accusantium in voluptates facilis officia dolor soluta iure officiis accusamus facere corrupti quasi possimus ratione vel esse debitis doloremque voluptate rerum odio impedit, quia animi minima. Nam repellendus aperiam dolores et, facilis molestiae inventore quos minima dolor eum consectetur pariatur.</p>
        </div>

        <div ref={scrollRef} className="flex justify-center items-start flex-col gap-6 m-5 pt-6">
            <div className="w-20 h-20 bg-orange-400">

            </div>
            <div className="w-20 h-20 bg-green-600">

            </div>
        </div>
    </div>
  )
}

export default Sample