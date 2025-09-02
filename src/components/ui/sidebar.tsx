
"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTrigger as RadixSheetTrigger } from "@/components/ui/sheet"
import { Button } from "./button"
import { Menu } from "lucide-react"

// A simple wrapper around Sheet for sidebar use cases.
// It can be triggered by the SheetTrigger component.
const Sidebar = ({ children, ...props }: React.ComponentProps<typeof Sheet>) => {
  return (
    <Sheet {...props}>
      {children}
    </Sheet>
  )
}

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <RadixSheetTrigger asChild>
        <Button ref={ref} variant="ghost" size="icon" className={className} {...props}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    </RadixSheetTrigger>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarContent = React.forwardRef<
    React.ElementRef<typeof SheetContent>,
    React.ComponentProps<typeof SheetContent>
>(({ className, ...props }, ref) => {
    return (
        <SheetContent ref={ref} className={className} {...props} />
    )
})
SidebarContent.displayName = "SidebarContent"


export {
  Sidebar,
  SidebarTrigger,
  SidebarContent
}
