import { FilesIcon, Moon, Plus, Sun, Sunset } from 'lucide-react'
import React, { JSX } from 'react'
import ReusableSheet from '@renderer/components/reusable components/reusable-sheet'
import ReusableTooltip from '@renderer/components/reusable components/reusable-tooltip'

type PageHeroProps = {
  title?: string
  subtitle?: string
  type: 'greeting' | 'hero'
  buttonText?: string
  showButton?: boolean
  showBulkUploader?: boolean
  bulkUploader?: React.ReactNode
  bulkUploaderClass?: string
  bulkUploaderTitle?: string
  bulkUploaderDescription?: string
  bulkUploaderSaveButtonText?: string
  hideBulkUploaderHeader?: boolean
  hideBulkUploaderFooter?: boolean
  /** Content rendered inside the sheet when showButton is true */
  sheetContent?: React.ReactNode
  sheetTitle?: string
  sheetDescription?: string
  sheetIcon?: React.ReactNode
  sheetSaveButtonText?: string
  hideSheetHeader?: boolean
  hideSheetFooter?: boolean
  sheetSizeClass?: string
}

export const PageHero = ({
  title,
  subtitle,
  type,
  buttonText,
  showButton = false,
  showBulkUploader = false,
  bulkUploader,
  bulkUploaderClass,
  bulkUploaderTitle,
  bulkUploaderDescription,
  bulkUploaderSaveButtonText,
  hideBulkUploaderHeader,
  hideBulkUploaderFooter,
  sheetContent,
  sheetTitle,
  sheetDescription,
  sheetIcon,
  sheetSaveButtonText,
  hideSheetHeader,
  hideSheetFooter,
  sheetSizeClass
}: PageHeroProps): JSX.Element => {
  return (
    <div className="flex items-center text-primary justify-between gap-4 ">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          {type !== 'hero' && getTimeBasedIcon()}
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-row gap-2">
        {showButton && (
          <ReusableSheet
            trigger={
              <div className="btn-primary bg-primary cursor-pointer flex flex-row p-1.5 pe-2 rounded-lg text-sm ">
                <Plus className="size-4 text-gray-200 dark:text-secondary" />
                <span className="text-gray-200 dark:text-secondary">{buttonText}</span>
              </div>
            }
            title={sheetTitle ?? ''}
            description={sheetDescription}
            titleIcon={sheetIcon}
            formContent={sheetContent}
            saveButtonText={sheetSaveButtonText}
            hideHeader={hideSheetHeader}
            hideFooter={hideSheetFooter}
            popupClass={sheetSizeClass}
          />
        )}
        {showBulkUploader && (
          <ReusableSheet
            trigger={
              <ReusableTooltip
                trigger={<FilesIcon className="cursor-pointer" />}
                tooltip="Bulk Upload"
              />
            }
            title={bulkUploaderTitle ?? ''}
            description={bulkUploaderDescription}
            titleIcon={sheetIcon}
            formContent={bulkUploader}
            saveButtonText={bulkUploaderSaveButtonText}
            hideHeader={hideBulkUploaderHeader}
            hideFooter={hideBulkUploaderFooter}
            popupClass={bulkUploaderClass}
          />
        )}
      </div>
    </div>
  )
}

export function getTimeBasedIcon(date: Date = new Date()): JSX.Element {
  const hour = date.getHours()

  // 🌙 Night: 19 → 04
  if (hour >= 19 || hour < 5) {
    return <Moon className="size-5" />
  }

  // 🌅 Sunrise: 05 → 08
  // if (hour >= 5 && hour < 9) {
  //   return <DayCloudyIcon className="size-7" />
  // }

  // ☀️ Day: 05 → 16
  if (hour >= 5 && hour < 17) {
    return <Sun className="size-5" />
  }

  // 🌇 Sunset: 17 → 18
  return <Sunset className="size-5" />
}
