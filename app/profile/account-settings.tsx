"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AccountSettings() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update Password</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive order updates and promotional offers</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive text messages for order updates</p>
            </div>
            <Switch id="sms-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-notifications">Marketing</Label>
              <p className="text-sm text-muted-foreground">Receive marketing and promotional materials</p>
            </div>
            <Switch id="marketing-notifications" defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Save Preferences</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent>
          {showDeleteConfirm ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This action cannot be undone. All your data will be permanently removed. To confirm, please type
                "DELETE" below.
              </AlertDescription>
              <div className="mt-4">
                <Input placeholder="Type DELETE to confirm" className="mb-2" />
              </div>
            </Alert>
          ) : (
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {showDeleteConfirm ? (
            <>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive">Delete Account</Button>
            </>
          ) : (
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
