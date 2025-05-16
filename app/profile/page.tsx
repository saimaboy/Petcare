import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileInfo from "./profile-info"
import OrderHistory from "./order-history"
import AccountSettings from "./account-settings"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and view your order history</p>
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileInfo />
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>

        <TabsContent value="settings">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
