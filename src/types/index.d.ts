declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module '@/components/common/avatar' {
  export const Avatar: any;
  export const AvatarImage: any;
  export const AvatarFallback: any;
}

declare module '@/components/common/button' {
  export const Button: any;
}

declare module '@/components/common/card' {
  export const Card: any;
  export const CardContent: any;
  export const CardHeader: any;
  export const CardTitle: any;
  export const CardFooter: any;
  export const CardDescription: any;
}

declare module '@/components/layout/sidebar-content' {
  const SidebarContent: any;
  export default SidebarContent;
}

declare module '@/hooks/use-mobile' {
  export const useMobile: any;
}
