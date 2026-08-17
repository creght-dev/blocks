"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"

import "./button-glass.css"

export type ButtonGlassProps = ButtonHTMLAttributes<HTMLButtonElement>

const SHADOW_TEXTURE =
  "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAZhtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgACAAAAAAG8AAEAAAAAAAADPgABAAAAAAT6AAEAAAAAAAAAJAAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAAAAAIAAGF2MDEAAAAA12lwcnAAAACxaXBjbwAAABNjb2xybmNseAABAA0ABoAAAAAMYXYxQ4EEHAAAAAAUaXNwZQAAAAAAAAIvAAACDQAAAA5waXhpAAAAAAEIAAAAOGF1eEMAAAAAdXJuOm1wZWc6bXBlZ0I6Y2ljcDpzeXN0ZW1zOmF1eGlsaWFyeTphbHBoYQAAAAAMYXYxQ4EkAgAAAAAUaXNwZQAAAAAAAAIvAAACDQAAABBwaXhpAAAAAAMICAgAAAAeaXBtYQAAAAAAAAACAAEEAYYHCAACBIIDBIUAAAAaaXJlZgAAAAAAAAAOYXV4bAACAAEAAQAAA2ptZGF0EgAKBxkmYugzhUAysAZENAEEFN7ez9TLWbALyvpIM/F2Df6bg9L4exsSR/wsANqn6ov3dquZ84/30cEWKhZBg1OTDm8vyJjUhMvxaEv1JyBkXSZEh53nsMkXlVJRsxiTrrL82hBadRRsn3bFgltnMCn4We4DDxDjI3bQyLwY6hwQjT7xJCTqQ7Wwl1ubczRD9wgaV8PKlCgsSMyg4BfkZvKShlSV1G2DuqWXp9pDOOGobuOaJDKvlCSvUNlRKwDCIfrJCnvBfxpKiuluBSFGbu4pen1Ouw6/FzRN5BRtxJZy5qplhv++Tf4Ji2HpO0uGLND1q6AXeVHKFt984Cgx6LbPNSGstQtWzNuFu0rZquqzpYcSU2nb7hSsop9wMrLbzvx1wSDubt6ClAGuXP0YLLvh1fRX3iXqJvjrWxJ2kjxddt0rJe9BIhzcOATvhgP1ZpcKbAjNGWhaZSpUH2Hjaa5wQYaemMXjH4gAx8N7lwALecQG8cnu6rDcqFcPl8D8a+fpk7U5pqwNCC2zixDkZ7mzw7i+tAbtfvyugjqRWLTUHc1LEkd2XNOpGdQ/+czt4BILk5eBDFPPpUxsoJxlhXC/9sDX3zD8tQdoHFHyJ+iLl7Av7wo3E6VimSQdV6yXT2NpRD07mtJv5IufB66AACRt8XC6l5Ap/gB4EWHIraJKGoiC5DHCrFRJcJqbNDmN6C43LQ1wLzlzCNdNV4UNztvRyDhQIRc+vAOyDEcnTu4fLslEELlRLZqCjZlVQI7uXdueqrCnGuJeIwJv3oM7qvfiK6qvUWkL2M60rXTjBwVtUbXrsuzD74bNc60aen/VOwOIyJQeVEoRPoLiBi/tnSs2oasinHldepA3KZiHiQaXIAEeilcWDu0xDZ0uQrhcTCZNxNTt0X+4pnUIu0MAkE6samLDsxDk3yT1kqG8+pX3F2zdF2uYqq34OMezrr7Hlaz/uKPJ9Q5dRSlpbzpdHXDjPXWliy64L2wUZFKvY9rCZruj7TQSIcl70Q725qFDhiQL9rj6gucYV702zqQFCIYiwexUUl6l4MDWH5eXaB2w/WRILKY2oihABUyO48CUFVPt3uGgLt6aQXJHtokSAAoKOSZi6DOEBDQaQDIUENAAABQMWPbNd2R5OldHxNv1mAQ="

export const ButtonGlass = forwardRef<HTMLButtonElement, ButtonGlassProps>(
  function ButtonGlass(
    { children = "Generate", className = "", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={`creght-glass-button ${className}`.trim()}
        data-testid="glass-button"
      >
        <span className="creght-glass-button__shell" aria-hidden="true">
          <span className="creght-glass-button__inner">
            <span className="creght-glass-button__outer-shadow">
              <span className="creght-glass-button__inner-shadow" />
            </span>

            <span className="creght-glass-button__label">{children}</span>
            <span className="creght-glass-button__label-reflection">{children}</span>
            <span className="creght-glass-button__shine" />
            <span className="creght-glass-button__dots" />
          </span>

          <span className="creght-glass-button__side-shadow creght-glass-button__side-shadow--left">
            <span className="creght-glass-button__shadow-art creght-glass-button__shadow-art--left">
              <img src={SHADOW_TEXTURE} alt="" />
            </span>
          </span>

          <span className="creght-glass-button__side-shadow creght-glass-button__side-shadow--right">
            <span className="creght-glass-button__shadow-art creght-glass-button__shadow-art--right">
              <img src={SHADOW_TEXTURE} alt="" />
            </span>
          </span>
        </span>

        <span className="creght-glass-button__depth" aria-hidden="true" />
        <span className="creght-glass-button__sr-only">{children}</span>
      </button>
    )
  },
)

export default ButtonGlass
