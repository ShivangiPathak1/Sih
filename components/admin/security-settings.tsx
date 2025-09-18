"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, CheckCircle, QrCode, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showSetup2FA, setShowSetup2FA] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [qrCode, setQrCode] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: false,
    auditLogging: true,
    emailNotifications: true,
  })

  const handleSetup2FA = () => {
    console.log("[v0] Setting up 2FA")
    // Generate QR code and backup codes
    setQrCode(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    )
    setBackupCodes(["ABC123DEF456", "GHI789JKL012", "MNO345PQR678", "STU901VWX234", "YZA567BCD890"])
    setShowSetup2FA(true)
  }

  const handleEnable2FA = () => {
    if (verificationCode.length === 6) {
      console.log("[v0] Enabling 2FA with code:", verificationCode)
      setTwoFactorEnabled(true)
      setShowSetup2FA(false)
      setVerificationCode("")
    }
  }

  const handleDisable2FA = () => {
    console.log("[v0] Disabling 2FA")
    setTwoFactorEnabled(false)
    setBackupCodes([])
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"))
  }

  const updateSecuritySetting = (key: string, value: any) => {
    console.log(`[v0] Updating security setting: ${key} = ${value}`)
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Security Settings</h2>
        <p className="text-muted-foreground">Manage your account security and authentication</p>
      </div>

      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-4">
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">2FA Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorEnabled
                      ? "Two-factor authentication is enabled"
                      : "Two-factor authentication is disabled"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  {twoFactorEnabled ? (
                    <Button variant="outline" onClick={handleDisable2FA}>
                      Disable 2FA
                    </Button>
                  ) : (
                    <Dialog open={showSetup2FA} onOpenChange={setShowSetup2FA}>
                      <DialogTrigger asChild>
                        <Button onClick={handleSetup2FA}>Setup 2FA</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
                          <DialogDescription>Scan the QR code with your authenticator app</DialogDescription>
                        </DialogHeader>
                        <Setup2FADialog
                          qrCode={qrCode}
                          backupCodes={backupCodes}
                          verificationCode={verificationCode}
                          setVerificationCode={setVerificationCode}
                          onEnable={handleEnable2FA}
                          onCopyBackupCodes={copyBackupCodes}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>

              {twoFactorEnabled && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>2FA Enabled</AlertTitle>
                  <AlertDescription>
                    Your account is protected with two-factor authentication. Keep your backup codes safe.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Input
                    id="password-expiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => updateSecuritySetting("passwordExpiry", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="login-attempts">Max Login Attempts</Label>
                  <Input
                    id="login-attempts"
                    type="number"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => updateSecuritySetting("loginAttempts", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
              <Button variant="outline">Force Password Reset for All Users</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access-control" className="space-y-4">
          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Session Timeout</h4>
                  <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => updateSecuritySetting("sessionTimeout", Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm">minutes</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">IP Whitelist</h4>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                </div>
                <Switch
                  checked={securitySettings.ipWhitelist}
                  onCheckedChange={(checked) => updateSecuritySetting("ipWhitelist", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Get notified of security events via email</p>
                </div>
                <Switch
                  checked={securitySettings.emailNotifications}
                  onCheckedChange={(checked) => updateSecuritySetting("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Audit Logging</h4>
                  <p className="text-sm text-muted-foreground">Log all security-related activities</p>
                </div>
                <Switch
                  checked={securitySettings.auditLogging}
                  onCheckedChange={(checked) => updateSecuritySetting("auditLogging", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { event: "Admin login", ip: "192.168.1.1", time: "2024-01-15 10:30:00", status: "success" },
                  { event: "Failed login attempt", ip: "192.168.1.100", time: "2024-01-15 09:15:00", status: "failed" },
                  { event: "Password changed", ip: "192.168.1.1", time: "2024-01-14 16:45:00", status: "success" },
                  { event: "2FA enabled", ip: "192.168.1.1", time: "2024-01-14 14:20:00", status: "success" },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{log.event}</h4>
                      <p className="text-sm text-muted-foreground">IP: {log.ip}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.status === "success" ? "default" : "destructive"}>{log.status}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Setup2FADialog({
  qrCode,
  backupCodes,
  verificationCode,
  setVerificationCode,
  onEnable,
  onCopyBackupCodes,
}: {
  qrCode: string
  backupCodes: string[]
  verificationCode: string
  setVerificationCode: (code: string) => void
  onEnable: () => void
  onCopyBackupCodes: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-white p-4 rounded-lg border inline-block">
          <QrCode className="h-32 w-32 mx-auto" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">Scan this QR code with your authenticator app</p>
      </div>

      <div>
        <Label htmlFor="verification-code">Verification Code</Label>
        <Input
          id="verification-code"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          maxLength={6}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Backup Codes</Label>
          <Button variant="outline" size="sm" onClick={onCopyBackupCodes}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <div className="bg-muted p-3 rounded-lg">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm">
              {code}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Save these backup codes in a safe place. You can use them to access your account if you lose your
          authenticator device.
        </p>
      </div>

      <Button onClick={onEnable} className="w-full" disabled={verificationCode.length !== 6}>
        Enable 2FA
      </Button>
    </div>
  )
}
