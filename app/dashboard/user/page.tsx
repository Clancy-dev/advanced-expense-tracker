import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserActivity } from "@/components/user-activity"
import { getAuthUser } from "@/lib/dal"

export default async function UserPage() {
  const user = await getAuthUser()

  const fullName = user?.fullName || "User"
  const email = user?.email || "user@example.com"
  const initials = fullName
    .split(" ")
    .map(name => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight lg:ml-0 md:ml-0 sm:ml-0 ml-12">Profile</h1>
      <p className="text-slate-500">Manage your account and view your activity.</p>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-bold">{fullName}</h2>
                <p className="text-sm text-slate-500">{email}</p>
              </div>
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent financial activities and account actions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserActivity />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Personal Information</h3>
                      <p className="text-sm text-slate-500">Update your personal details and contact information.</p>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Notification Preferences</h3>
                      <p className="text-sm text-slate-500">Configure how and when you receive notifications.</p>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Currency Settings</h3>
                      <p className="text-sm text-slate-500">Currently set to Uganda Shillings (UGX).</p>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and authentication.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-slate-500">Update your password to maintain account security.</p>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Login History</h3>
                      <p className="text-sm text-slate-500">View your recent login activity.</p>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
