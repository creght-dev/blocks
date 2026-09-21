export const BUTTON_GLASS_CSS = String.raw`
.glass-button-preview-stage {
  position: relative;
  display: flex;
  min-height: 100dvh;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
  background: #d7d7d7;
}

.glass-button-preview-stage::before {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTAgMGg5NnY5NkgwWiIvPjxwYXRoIGQ9Ik0yNCAyMGE0IDQgMCAxIDEgMCA4IDQgNCAwIDAgMSAwLThtMCA0OGE0IDQgMCAxIDEgMCA4IDQgNCAwIDAgMSAwLThtNDggMGE0IDQgMCAxIDEgMCA4IDQgNCAwIDAgMSAwLThtMC00OGE0IDQgMCAxIDEgMCA4IDQgNCAwIDAgMSAwLTgiLz48L3N2Zz4=");
  background-position: left top;
  background-repeat: repeat;
  background-size: 96px 96px;
  content: "";
  opacity: 0.06;
  pointer-events: none;
}

.creght-glass-button {
  --responsive-scale: 1;
  position: relative;
  z-index: 1;
  display: block;
  flex: 0 0 auto;
  width: 466px;
  height: 202px;
  margin: 0;
  padding: 0;
  overflow: visible;
  border: 0;
  border-radius: 314px;
  appearance: none;
  background: transparent;
  color: #272b2d;
  cursor: pointer;
  transform: scale(var(--responsive-scale));
  transform-origin: 50% 50%;
  -webkit-tap-highlight-color: transparent;
}

.creght-glass-button:focus-visible {
  outline: 3px solid rgb(255 255 255 / 78%);
  outline-offset: 8px;
}

.creght-glass-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.creght-glass-button__shell,
.creght-glass-button__inner,
.creght-glass-button__outer-shadow,
.creght-glass-button__inner-shadow,
.creght-glass-button__label,
.creght-glass-button__label-reflection,
.creght-glass-button__shine,
.creght-glass-button__dots,
.creght-glass-button__side-shadow,
.creght-glass-button__shadow-art,
.creght-glass-button__depth {
  position: absolute;
  display: block;
  pointer-events: none;
}

.creght-glass-button__shell {
  z-index: 1;
  inset: 0 2px;
  overflow: hidden;
  padding: 4px;
  border-radius: 314px;
  background: radial-gradient(29% 50% at 12.8% 37.8%, rgb(156 156 156) 0%, rgb(255 255 255) 100%);
  box-shadow: 0 16px 18px -15px rgb(0 0 0 / 47%);
  transform: perspective(5000px) scale(1);
  transform-origin: 50% 50%;
  transition:
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
    background 560ms ease,
    box-shadow 560ms ease;
}

.creght-glass-button__inner {
  z-index: 5;
  inset: 4px;
  overflow: hidden;
  border-radius: 314px;
  background: linear-gradient(0deg, rgb(242 242 242) 0%, rgb(215 215 215) 25%, rgb(215 215 215) 57%, rgb(230 230 230) 100%);
}

.creght-glass-button__outer-shadow {
  z-index: 7;
  top: 1px;
  right: -2px;
  bottom: -12px;
  left: -2px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(0deg, rgb(0 0 0 / 0%) 0%, rgb(0 0 0 / 45%) 72%);
  mask-image: linear-gradient(0deg, rgb(0 0 0 / 0%) 0%, rgb(0 0 0 / 45%) 72%);
}

.creght-glass-button__inner-shadow {
  z-index: 3;
  top: 30.5px;
  right: 21px;
  bottom: -0.5px;
  left: 21px;
  overflow: hidden;
  border: 8px solid #000;
  border-radius: 314px;
  filter: blur(12px);
}

.creght-glass-button__label,
.creght-glass-button__label-reflection {
  left: 50%;
  margin: 0;
  white-space: nowrap;
  font-family: Inter, "Inter Placeholder", Arial, sans-serif;
  font-weight: 500;
  font-style: normal;
}

.creght-glass-button__label {
  z-index: 1;
  top: 50%;
  color: rgb(39 43 45);
  font-size: 69px;
  line-height: 1.2;
  letter-spacing: -0.06em;
  transform: translate(-50%, -50%);
}

.creght-glass-button__label-reflection {
  z-index: 0;
  top: 74px;
  color: rgb(19 20 21);
  font-size: 70px;
  line-height: 1.2;
  letter-spacing: -0.06em;
  opacity: 0.15;
  filter: blur(2px);
  transform: translateX(-50%);
}

.creght-glass-button__shine {
  z-index: 6;
  top: -68.828px;
  right: -125px;
  bottom: -134.172px;
  left: 399px;
  overflow: hidden;
  background: linear-gradient(270deg, rgb(255 255 255 / 70%) 0%, rgb(255 255 255 / 63%) 33.356%, #fff 59.91%, #fff 88.139%, rgb(255 255 255 / 23%) 100%);
  opacity: 0.52;
  filter: blur(10px);
  transform: rotate(45deg);
}

.creght-glass-button__dots {
  inset: 0;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTAgMGg5NnY5NkgwWiIvPjxwYXRoIGQ9Ik0yNCAyMGE0IDQgMCAxIDEgMCA4IDQgNCAwIDAgMSAwLThtMCA0OGE0IDQgMCAxIDEgMCA4IDQgNCAwIDAgMSAwLThtNDggMGE0IDQgMCAxIDEgMCA4IDQgNCAwIDAgMSAwLThtMC00OGE0IDQgMCAxIDEgMCA4IDQgNCAwIDAgMSAwLTgiLz48L3N2Zz4=");
  background-position: left top;
  background-repeat: repeat;
  background-size: 96px 96px;
  opacity: 0;
  transition: opacity 460ms ease;
}

.creght-glass-button__side-shadow {
  top: 2px;
  right: 2px;
  bottom: 2px;
  left: 2px;
  overflow: hidden;
  border-radius: 314px;
  opacity: 0.6;
}

.creght-glass-button__side-shadow--left {
  z-index: 2;
  background: radial-gradient(25% 58% at 1.8% 19.9%, rgb(148 148 148) 0%, rgb(184 184 184 / 69%) 55%, rgb(99 99 99 / 0%) 100%);
}

.creght-glass-button__side-shadow--right {
  z-index: 1;
  background: radial-gradient(25% 58% at 90.4% 81.6%, rgb(148 148 148) 0%, rgb(184 184 184 / 69%) 55%, rgb(99 99 99 / 0%) 100%);
}

.creght-glass-button__shadow-art {
  overflow: visible;
}

.creght-glass-button__shadow-art--left {
  top: -41px;
  left: 208px;
  width: 355.625px;
  height: 333.992px;
  opacity: 0.71;
}

.creght-glass-button__shadow-art--right {
  top: -87.344px;
  left: -124px;
  width: 356px;
  height: 334.344px;
  opacity: 0.6;
}

.creght-glass-button__shadow-art img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.creght-glass-button__depth {
  z-index: 0;
  inset: 0 2px 1px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 25%);
  border-radius: 314px;
  background: #fff;
  transform: perspective(1200px);
  transform-origin: 50% 50%;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.creght-glass-button:not(:disabled):is(:hover, :focus-visible) .creght-glass-button__shell {
  background: radial-gradient(29% 50% at 20.1% 79.3%, rgb(156 156 156) 0%, rgb(255 255 255) 100%);
  box-shadow: 0 5px 7px -4px rgb(0 0 0 / 19%);
  transform: perspective(5000px) scale(0.95);
}

.creght-glass-button:not(:disabled):is(:hover, :focus-visible) .creght-glass-button__dots {
  opacity: 0.07;
}

.creght-glass-button:not(:disabled):is(:hover, :focus-visible) .creght-glass-button__depth {
  transform: perspective(1200px) scale(0.95);
}

.creght-glass-button__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 809px) {
  .creght-glass-button {
    --responsive-scale: 0.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .creght-glass-button__shell,
  .creght-glass-button__dots,
  .creght-glass-button__depth {
    transition-duration: 0.01ms;
  }
}
`

