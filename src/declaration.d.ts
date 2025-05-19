declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const content: string;
  export default content;
}

declare module '@/components/common/*' {
  const component: any;
  export default component;
  export const Avatar: any;
  export const AvatarImage: any;
  export const AvatarFallback: any;
  export const Button: any;
  export const Card: any;
  export const CardContent: any;
  export const CardHeader: any;
  export const CardTitle: any;
  export const CardFooter: any;
  export const Input: any;
  export const Textarea: any;
  export const DropdownMenu: any;
  export const DropdownMenuContent: any;
  export const DropdownMenuItem: any;
  export const DropdownMenuSeparator: any;
  export const DropdownMenuTrigger: any;
}

declare module '@/components/layout/*' {
  const component: any;
  export default component;
}

declare module '@/components/features/*' {
  const component: any;
  export default component;
}

declare module '@/hooks/*' {
  const hook: any;
  export default hook;
  export const useMobile: any;
}
