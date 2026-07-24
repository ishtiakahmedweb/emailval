import { type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ children, size = 24, viewBox, ...props }: IconProps & { viewBox: string }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {children}
    </svg>
  );
}

function Icon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>{children}</svg>;
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M208 40H48a16 16 0 0 0-16 16v56c0 52.72 25.52 84.67 46.93 102.19 23.06 18.86 46 25.26 47 25.53a8 8 0 0 0 4.2 0c1-.27 23.91-6.67 47-25.53C198.48 196.67 224 164.72 224 112V56a16 16 0 0 0-16-16m0 72c0 37.07-13.66 67.16-40.6 89.42a129.3 129.3 0 0 1-39.4 22.2 128.3 128.3 0 0 1-38.92-21.81C61.82 179.51 48 149.3 48 112V56h160ZM82.34 141.66a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32l-56 56a8 8 0 0 1-11.32 0Z" />
    </Icon>
  );
}

export function EmailBlockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1m0 2v2.59l-8 5.33L4 8.59V6ZM4 18v-8.08l7.55 5.04a.7.7 0 0 0 .81 0L20 9.92V18Z" />
    </Icon>
  );
}

export function EmailSecurityIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1m0 2v2.59l-8 5.33L4 8.59V6ZM4 18v-8.08l7.55 5.04a.7.7 0 0 0 .81 0L20 9.92V18Z" />
    </Icon>
  );
}

export function EmailSuccessIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="m141.66 101.66-40 40a8 8 0 0 1-11.32 0l-16-16a8 8 0 0 1 11.32-11.32L96 125.34l34.34-34.34a8 8 0 0 1 11.32 11.32M224 112v40c0 52.72-25.52 84.67-46.93 102.19-23.06 18.86-46 25.26-47 25.53a8 8 0 0 1-4.2 0c-1-.27-23.91-6.67-47-25.53C57.52 196.67 32 164.72 32 112V56a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16v56m-16 0V56H48v56c0 37.07 13.66 67.16 40.6 89.42a129.3 129.3 0 0 0 39.4 22.2 128.3 128.3 0 0 0 38.92-21.81C178.18 179.51 192 149.3 192 112Z" />
    </Icon>
  );
}

export function ChartLineIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M242 208a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V48a6 6 0 0 1 12 0v154h198a6 6 0 0 1 6 6m-26.46-130.24a6 6 0 0 1 .7 8.46l-40 48a6 6 0 0 1-8.17.84l-35.33-28.26-39.19 52.26a6 6 0 0 1-16.72 1.22l-32-24a6 6 0 0 1 7.42-9.44l28.61 21.46 38.81-51.74a6 6 0 0 1 8.17-1.17l35.33 28.27 36-43.18a6 6 0 0 1 8.46-.7Z" />
    </Icon>
  );
}

export function DatabaseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M128 24C74.17 24 32 48.6 32 80v96c0 31.4 42.17 56 96 56s96-24.6 96-56V80c0-31.4-42.17-56-96-56m0 16c46.56 0 80 20 80 40s-33.44 40-80 40-80-20-80-40 33.44-40 80-40M48 176v-32c11.76 10.64 31.8 19.34 56 24.6v32c-24.2-5.26-44.24-14-56-24.6m72 24.6v-32a197.6 197.6 0 0 0 56 0v32a197.6 197.6 0 0 1-56 0m72-56.2V176c-11.76 10.64-31.8 19.34-56 24.6v-32c24.2-5.26 44.24-14 56-24.6" />
    </Icon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m-14 17.08A192.44 192.44 0 0 0 89.9 72h-38a88.47 88.47 0 0 1 62.1-30.92M48.08 88h39.18a188 188 0 0 0 0 80H48.08a88.2 88.2 0 0 1 0-80m3.81 96h38.08A192.44 192.44 0 0 0 114 214.92 88.47 88.47 0 0 1 51.89 184M128 216c-3.94 0-16.63-14.2-26.41-40h52.82c-9.78 25.8-22.47 40-26.41 40m12.07-56h-24.14a171.6 171.6 0 0 1 0-80h24.14a171.6 171.6 0 0 1 0 80m12.07-96a192.44 192.44 0 0 1 24.07 48h38.08a88.47 88.47 0 0 0-62.1-30.92zM200 88h-39.19a188 188 0 0 1 0 80H200a88.2 88.2 0 0 0 0-80m-4.08 96a88.47 88.47 0 0 1-62.1 30.92A192.44 192.44 0 0 0 158.1 184Z" />
    </Icon>
  );
}

export function CloudCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M164 128a6 6 0 0 1-6 6H98a6 6 0 0 1 0-12h60a6 6 0 0 1 6 6m46-26c0 .7 0 1.41-.06 2.11A54 54 0 0 1 160 202H88a62 62 0 0 1-12.17-123 6 6 0 0 1 7.49 4.17A50 50 0 0 0 88 90h.18a6 6 0 0 1 5.88-4.32 47.8 47.8 0 0 1 9.09-10.32 50 50 0 0 1 83.94 35.56 6 6 0 0 0 5.89 5.54A42 42 0 0 1 210 102m-12 0a30 30 0 0 0-29.17-30h-.44a6 6 0 0 1-6-5.64A38 38 0 0 0 88 72.74a6 6 0 0 1-7.66 5.61A50 50 0 0 0 88 190h72a42 42 0 0 0 38-54.15 42 42 0 0 0 0-33.85m-48.44 26.24a6 6 0 0 0-11.32-3.94l-12 34.35-8.3-8.3a6 6 0 0 0-8.48 8.48l13 13a6 6 0 0 0 5.66 1.57 6 6 0 0 0 3.46-3.11Z" />
    </Icon>
  );
}

export function FilesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="m221.66 90.34-48-48A8 8 0 0 0 168 40H72a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16V96a8 8 0 0 0-2.34-5.66M176 59.31 196.69 80H176ZM184 200H72V56h88v24a8 8 0 0 0 8 8h16ZM40 176V64a8 8 0 0 1 16 0v112a8 8 0 0 0 8 8h112a8 8 0 0 1 0 16H64a24 24 0 0 1-24-24" />
    </Icon>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M240 72a20 20 0 1 0-25.51 19.22L196.07 136H196l-31.49-60.86A20 20 0 1 0 150 68.34L128 88.68l-22-20.34a20 20 0 1 0-14.65 5.81s0-.07.07-.11L59.93 136h-.07L41.51 91.22A20 20 0 1 0 22.94 88c0 .3-.08.58-.08.89a20 20 0 1 0 39.79 2l18.8 45.41A8 8 0 0 0 89 144h78a8 8 0 0 0 7.57-5.67l18.8-45.41a20 20 0 0 0 38.57-9.69 20 20 0 0 0 0-11.25v-.06A20 20 0 0 0 240 72M48 88a4 4 0 1 1 4-4 4 4 0 0 1-4 4m80-8a4 4 0 1 1 4-4 4 4 0 0 1-4 4m80 8a4 4 0 1 1 4-4 4 4 0 0 1-4 4m-8 80v24a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8v-24a8 8 0 0 0-16 0v24a24 24 0 0 0 24 24h128a24 24 0 0 0 24-24v-24a8 8 0 0 0-16 0" />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path fill="currentColor" d="M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88 88.1 88.1 0 0 0 88-88" />
    </Icon>
  );
}
