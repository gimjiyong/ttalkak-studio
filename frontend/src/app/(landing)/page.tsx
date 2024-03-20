'use client'

import { useState, useEffect } from 'react'
import ShareIcon from '@@/assets/icons/share.svg'
import Button from '@/components/Button'
import SlideupModal from '@/components/SlideupModal'
import LogoSmall from '@@/assets/icons/logo-small.svg'
import XIcon from '@@/assets/icons/x.svg'
import AlertIcon from '@@/assets/icons/triangle-alert.svg'
import InstallWrapper from './_components/InstallWrapper'
import XWrapper from './_components/XWrapper'
import InstallHeader from './_components/InstallHeader'
import InstallLogo from './_components/InstallLogo'
import ContentsWrapper from './_components/ContentsWrapper'

function LandingPage() {
  // const router = useRouter()
  const [device, setDevice] = useState<string | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [seen, setSeen] = useState<boolean>(false)
  const [isClose, setIsClose] = useState<boolean>(true)

  const handleBeforeInstallPrompt = (event: any) => {
    event.preventDefault()
    setDeferredPrompt(event)
  }

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()

      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
      })
    }
  }

  const handleClose = async () => {
    setIsClose(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setSeen(false)
  }

  const renderMessage = () => {
    if (device === 'web') {
      return (
        <ContentsWrapper>
          <AlertIcon width="2rem" height="2rem" />
          <p>모바일로 접속해 주세요</p>
        </ContentsWrapper>
      )
    } else if (device === 'android') {
      return deferredPrompt ? (
        <Button
          $fontSize="1.5rem"
          $padding="0.5rem 1rem"
          $borderRadius="1rem"
          onClick={() => {
            handleInstallClick()
            handleClose()
          }}
        >
          앱 다운로드
        </Button>
      ) : (
        <ContentsWrapper>
          <AlertIcon width="2rem" height="2rem" />
          <p>앱을 이용해 주세요</p>
        </ContentsWrapper>
      )
    } else if (device === 'iphone') {
      return (
        <ContentsWrapper>
          <p style={{ width: 'auto' }}>
            <span style={{ verticalAlign: 'middle' }}>
              <ShareIcon width="1.5rem" height="1.5rem" color="dodgerblue" />
            </span>
            의 <span style={{ color: 'dodgerblue' }}>홈 화면에 추가</span>
            를 통해
            <br />
            다운로드해 주세요
          </p>
        </ContentsWrapper>
      )
    }
  }

  useEffect
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    const agent = navigator.userAgent
    let tempDevice = 'web'

    if (agent.toLowerCase().indexOf('android') >= 0) {
      tempDevice = 'android'
    } else if (agent.toLowerCase().indexOf('iphone') >= 0) {
      tempDevice = 'iphone'
    }

    setDevice(tempDevice)
    setIsClose(false)
    setSeen(true)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
    }
  }, [])

  return (
    <>
      {seen && (
        <SlideupModal
          isClose={isClose}
          height="20rem"
          handleClose={handleClose}
        >
          <InstallWrapper>
            <InstallHeader>
              <XWrapper
                onClick={() => {
                  handleClose()
                }}
              >
                <XIcon />
              </XWrapper>
              <InstallLogo>
                <LogoSmall />
              </InstallLogo>
            </InstallHeader>
            <h2 style={{ width: '90%', marginBottom: '2rem' }}>
              앱을 사용하여 최적의 환경에서 이용해 보세요
            </h2>
            {renderMessage()}
          </InstallWrapper>
        </SlideupModal>
      )}
    </>
  )
}

export default LandingPage
