"use client"

import { useEffect, useRef, useState } from "react"

export function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null)
  const follower2Ref = useRef<HTMLDivElement>(null)
  const follower3Ref = useRef<HTMLDivElement>(null)
  
  // Use refs to track positions to avoid infinite loops
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const followerPositionRef = useRef({ x: 0, y: 0 })
  const follower2PositionRef = useRef({ x: 0, y: 0 })
  const follower3PositionRef = useRef({ x: 0, y: 0 })
  
  const animationRef = useRef<number>(null)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isTouchDevice || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // If mobile, don't render the custom cursor
  if (isMobile) {
    return null
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }

    // Helper function to check if an element is interactive
    const isInteractiveElement = (element: HTMLElement): boolean => {
      return element.tagName === 'BUTTON' || 
             element.tagName === 'A' || 
             element.tagName === 'INPUT' || 
             element.tagName === 'TEXTAREA' || 
             element.tagName === 'SELECT' ||
             !!element.closest('button') ||
             !!element.closest('a') ||
             !!element.closest('input') ||
             !!element.closest('textarea') ||
             !!element.closest('select') ||
             element.style.cursor === 'pointer' ||
             element.classList.contains('cursor-pointer') ||
             element.onclick !== null ||
             element.getAttribute('onclick') !== null
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHoveringInteractive(isInteractiveElement(target))
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement
      
      // Check if we're leaving an interactive element
      const isLeavingInteractive = isInteractiveElement(target)
      
      // Check if we're entering another interactive element
      const isEnteringInteractive = relatedTarget && isInteractiveElement(relatedTarget)
      
      // Only set to false if we're leaving an interactive element and not entering another one
      if (isLeavingInteractive && !isEnteringInteractive) {
        setIsHoveringInteractive(false)
      }
    }

    const animateFollower = () => {
      // Main follower (closest to cursor)
      const dx1 = mousePositionRef.current.x - followerPositionRef.current.x
      const dy1 = mousePositionRef.current.y - followerPositionRef.current.y
      // Increase friction (faster following) when cursor is hidden
      const friction1 = cursorVisible ? 1 : 0.7
      const newX1 = followerPositionRef.current.x + dx1 * friction1
      const newY1 = followerPositionRef.current.y + dy1 * friction1
      followerPositionRef.current = { x: newX1, y: newY1 }

      // Second follower (medium delay)
      const dx2 = followerPositionRef.current.x - follower2PositionRef.current.x
      const dy2 = followerPositionRef.current.y - follower2PositionRef.current.y
      const friction2 = 0.3
      const newX2 = follower2PositionRef.current.x + dx2 * friction2
      const newY2 = follower2PositionRef.current.y + dy2 * friction2
      follower2PositionRef.current = { x: newX2, y: newY2 }

      // Third follower (most delay)
      const dx3 = follower2PositionRef.current.x - follower3PositionRef.current.x
      const dy3 = follower2PositionRef.current.y - follower3PositionRef.current.y
      const friction3 = 0.2
      const newX3 = follower3PositionRef.current.x + dx3 * friction3
      const newY3 = follower3PositionRef.current.y + dy3 * friction3
      follower3PositionRef.current = { x: newX3, y: newY3 }

      // Apply positions to DOM elements
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${newX1 - 20}px, ${newY1 - 20}px)`
      }
      if (follower2Ref.current) {
        follower2Ref.current.style.transform = `translate(${newX2 - 15}px, ${newY2 - 15}px)`
      }
      if (follower3Ref.current) {
        follower3Ref.current.style.transform = `translate(${newX3 - 10}px, ${newY3 - 10}px)`
      }

      animationRef.current = requestAnimationFrame(animateFollower)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)
    animateFollower()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [cursorVisible]) // Add cursorVisible to dependencies to re-run when it changes

  // Effect to hide default cursor when custom cursor is visible
  useEffect(() => {
    if (cursorVisible) {
      document.body.style.cursor = 'none'
      // Also hide cursor-pointer on interactive elements
      const style = document.createElement('style')
      style.id = 'custom-cursor-style'
      style.textContent = `
        *, *::before, *::after {
          cursor: none !important;
        }
        button, a, input, textarea, select, [role="button"], [tabindex] {
          cursor: none !important;
        }
        .cursor-pointer, .cursor-default, .cursor-auto {
          cursor: none !important;
        }
      `
      document.head.appendChild(style)
    } else {
      document.body.style.cursor = 'auto'
      // Remove the custom cursor style
      const existingStyle = document.getElementById('custom-cursor-style')
      if (existingStyle) {
        existingStyle.remove()
      }
    }

    return () => {
      document.body.style.cursor = 'auto'
      const existingStyle = document.getElementById('custom-cursor-style')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [cursorVisible])

  const toggleCursor = () => {
    setCursorVisible(!cursorVisible)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleCursor}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-gradient-to-r from-primary-tan to-accent-pink text-black rounded-lg shadow-lg hover:shadow-xl  font-medium"
      >
        {cursorVisible ? 'Mostra cursore' : 'Nascondi cursore'}
      </button>

      {/* Main follower */}
      <div
        ref={followerRef}
        className={`fixed pointer-events-none z-50 backdrop-blur-sm border border-white/30 shadow-lg ${
          cursorVisible 
            ? isHoveringInteractive
              ? 'w-8 h-8 bg-gradient-to-br from-gray-700/50 to-brown-500/50' // Darker colors when hovering interactive
              : 'w-10 h-10 bg-gradient-to-br from-primary-tan/40 to-accent-pink/40'
            : 'w-10 h-10 bg-gradient-to-br from-primary-tan/70 to-accent-pink/70'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          borderRadius: isHoveringInteractive ? '4px' : '50%',
        }}
      />
      
      {/* Second follower */}
      <div
        ref={follower2Ref}
        className={`fixed pointer-events-none z-40 backdrop-blur-sm border border-white/20 shadow-md ${
          isHoveringInteractive
            ? 'bg-gradient-to-br w-7 h-7 from-gray-600/50 to-brown-400/50' // Darker colors when hovering interactive
            : 'bg-gradient-to-br w-8 h-8 from-primary-tan/30 to-accent-pink/30'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          borderRadius: isHoveringInteractive ? '3px' : '50%',
        }}
      />
      
      {/* Third follower */}
      <div
        ref={follower3Ref}
        className={`fixed pointer-events-none z-30backdrop-blur-sm border border-white/10 shadow-sm ${
          isHoveringInteractive
            ? 'bg-gradient-to-br w-5 h-5 from-gray-500/50 to-brown-300/50' // Darker colors when hovering interactive
            : 'bg-gradient-to-br w-6 h-6  from-primary-tan/20 to-accent-pink/20'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          borderRadius: isHoveringInteractive ? '2px' : '50%',
        }}
      />
    </>
  )
} 