import React, { useEffect } from "react"
import { useCountUp } from "react-countup"

interface Props {
  value: number
}

export default function AnimatedCounter(props: Props) {
  const { countUp, update } = useCountUp({
    start: 0,
    end: 0,
    delay: 1000,
    duration: 1,
  })

  useEffect(() => {
    update(props.value)
  }, [props.value, update])

  return <>{countUp}</>
}
