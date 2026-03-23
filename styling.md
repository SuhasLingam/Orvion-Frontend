# Orvion UI/UX Styling Guide

This document tracks all the design tokens, components, and styling rules for the Orvion project to ensure consistency across the application.

## Global Rules
- **Frameworks:** Tailwind CSS, Framer Motion (for smooth scrolling and page transitions)
- **Responsiveness:** All components must be fully mobile responsive.
- **Interactions:** Smooth page navigation and scrolling, no broken changes between views.

## Typography
- Primary Font: SF Pro (`font-sans`)
- Weights used: Medium (500)

## Color Palette
- **Primary / Brand:** `#305EFF` (Enroll Now button)
- **Navbar Text:** `#695949`
- **Leaf Text:** `#462A00`
- **Navbar Background:** `linear-gradient(90deg, #FFFFFF 0%, #EBF0F5 100%)`
- **Hero Background:** `#F4F7FB`
- **Button Text:** `#FFFFFF`

## Components

### Navbar
- **Left:** Logo (`public/logo.svg`) + Text (`public/logo-text.svg`)
- **Center:** Nav Items ("About us", "Programs", "Internships", "Contact") - Color: `#695949`, Font: SF Pro Medium
- **Right:** "Enroll Now" Button - Bg: `#305EFF`, text: white
- **Background:** Gradient from White to `#EBF0F5`
- **Mobile:** Mobile responsive wrapper required (likely a hamburger menu)

### Hero
- **Background Container:** `#F4F7FB` rounded card inside `max-w-7xl`.
- **Text:** Large bold headline, "Tech Career" isolated with Primary Color.
- **Arrows:** Small grey right-arrows in subheading.
- **Buttons:** Primary "Enroll Now" and Outline "Book a call" (with Primary Color text/border).
- **Laurels:** 3 items using `public/leaf.svg` with absolute positioned `#462A00` text placed over the wreath.
