"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Globe, Search, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "./language-provider"

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, supportedLanguages, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)

  const filteredLanguages = supportedLanguages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode)
    setShowLanguageDialog(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings.language")}</h2>
        <p className="text-muted-foreground">Choose your preferred language for the interface</p>
      </div>

      {/* Current Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Current Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentLanguage.flag}</span>
              <div>
                <h3 className="font-medium">{currentLanguage.name}</h3>
                <p className="text-sm text-muted-foreground">{currentLanguage.nativeName}</p>
              </div>
            </div>
            <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Change Language</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Language</DialogTitle>
                  <DialogDescription>Choose your preferred language from the list below</DialogDescription>
                </DialogHeader>
                <LanguageSelector
                  languages={filteredLanguages}
                  currentLanguage={currentLanguage}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onLanguageSelect={handleLanguageChange}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Quick Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Select</CardTitle>
          <CardDescription>Popular languages for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {supportedLanguages.slice(0, 8).map((language) => (
              <Button
                key={language.code}
                variant={currentLanguage.code === language.code ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => handleLanguageChange(language.code)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium text-sm">{language.name}</div>
                    <div className="text-xs opacity-70">{language.nativeName}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Language Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{supportedLanguages.length}</div>
              <div className="text-sm text-muted-foreground">Total Languages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Indian Languages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">European Languages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">Asian Languages</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Language Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Languages by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Indian Languages</h4>
              <div className="flex flex-wrap gap-2">
                {supportedLanguages
                  .filter((lang) =>
                    ["hi", "bn", "te", "mr", "ta", "gu", "kn", "ml", "pa", "or", "as", "ur"].includes(lang.code),
                  )
                  .map((lang) => (
                    <Badge
                      key={lang.code}
                      variant={currentLanguage.code === lang.code ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.flag} {lang.name}
                    </Badge>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">European Languages</h4>
              <div className="flex flex-wrap gap-2">
                {supportedLanguages
                  .filter((lang) => ["en", "es", "fr", "de", "it", "pt", "ru"].includes(lang.code))
                  .map((lang) => (
                    <Badge
                      key={lang.code}
                      variant={currentLanguage.code === lang.code ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.flag} {lang.name}
                    </Badge>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">East Asian Languages</h4>
              <div className="flex flex-wrap gap-2">
                {supportedLanguages
                  .filter((lang) => ["ja", "ko", "zh", "th", "vi"].includes(lang.code))
                  .map((lang) => (
                    <Badge
                      key={lang.code}
                      variant={currentLanguage.code === lang.code ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.flag} {lang.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LanguageSelector({
  languages,
  currentLanguage,
  searchTerm,
  setSearchTerm,
  onLanguageSelect,
}: {
  languages: any[]
  currentLanguage: any
  searchTerm: string
  setSearchTerm: (term: string) => void
  onLanguageSelect: (code: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search languages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2">
        {languages.map((language) => (
          <div
            key={language.code}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              currentLanguage.code === language.code ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
            onClick={() => onLanguageSelect(language.code)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{language.flag}</span>
              <div>
                <div className="font-medium">{language.name}</div>
                <div className="text-sm opacity-70">{language.nativeName}</div>
              </div>
            </div>
            {currentLanguage.code === language.code && <Check className="h-4 w-4" />}
          </div>
        ))}
      </div>
    </div>
  )
}
