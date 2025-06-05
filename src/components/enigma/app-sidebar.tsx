import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FileText, HardDrive, PencilRuler, User } from "lucide-react";
import { SignOut } from "../../app/(main)/components/SignOut";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdContentPasteGo } from "react-icons/md";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { data: session } = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <User className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {session?.user?.displayName}
            </span>
            <span className="truncate text-xs">{session?.user?.role}</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menus.map((item, idx) => (
              <SidebarMenuItem key={idx}>
                <Link href={item.href}>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOut />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const menus = [
  {
    title: "Content Distribution",
    icon: MdContentPasteGo,
    href: "/",
  },
  {
    title: "Resource Bank",
    icon: HardDrive,
    href: "/resource-bank",
  },
  {
    title: "Proposal",
    icon: FileText,
    href: "/proposal",
  },
  {
    title: "Layout Editor",
    icon: PencilRuler,
    href: "/layout-editor",
  },
];
