import React from "react"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`skeleton-loader ${className || ''}`}
      {...props}
    />
  )
}

export { Skeleton }
