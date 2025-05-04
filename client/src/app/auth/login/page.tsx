import Link from "next/link"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Separator } from '@/components/ui/separator'
import HorizontalLineWithText from '@/components/horizontal-line-with-text'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import { HeaderLogo2 } from '@/components/logo'
import MagicLinkSignIn from '../(components)/magic-link-signin'
import EmailPasswordSignIn from '../(components)/email-password-signin'
import SSOSignIn from '../(components)/sso-signin'
import { toast } from "sonner"



const LoginPage = () => {


  return (<div className='relative h-full flex flex-col justify-center'>
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div className="hidden h-full  lg:flex flex-row justify-center  items-start">
        <AppIntroduce />

      </div>
      <div className=' h-full flex flex-col items-center justify-center w-full mt-0 md:mt-0'>

        <div className="w-full h-full  mb-6 text-2xl max-w-[350px] space-y-4">

          {/* <div className='flex flex-col mb-4'> */}
          <div className='grid grid-cols-1 gap-4  rounded-lg border border-dashed border-opacity-50 border-slate-400 p-4 '>
            <SSOSignIn className='w-full flex justify-center items-center' provider='google' variant={'outline'}>

              Google
            </SSOSignIn>

            {/* <SSOSignIn className='w-full flex justify-center items-center ' provider='yandex' variant={'outline'}>
              Yandex
            </SSOSignIn> */}

          </div>
          {/* </div> */}
          {/* <HorizontalLineWithText className='w-full' text='OR' />
          <div className='flex flex-col mb-4'>

            <div className='rounded-lg border border-dashed border-opacity-50 border-slate-400 p-4 space-y-4'>
              <Label >Email</Label>
              <EmailPasswordSignIn />

              <p className="w-full mt-6 text-start text-sm text-muted-foreground ">
                Don't have an account?
                <Link
                  href="/auth/register"
                  className="underline underline-offset-4 hover:text-primary ms-2"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
          <HorizontalLineWithText className='w-full' text='OR' />


          <div className='flex flex-col mb-4'>

            <div className='rounded-lg border border-dashed border-opacity-50 border-slate-400 p-4 space-y-4'>
              <Label >Magic Link</Label>
              <MagicLinkSignIn redirectUrl='/auth/login/checkEmail' />
            </div>
          </div> */}

          <p className="w-full mt-6 text-center text-xs text-muted-foreground ">
            By clicking continue, you agree to our{" "}
            <Link
              href="#"  // qwerty terms, privacy, dpa, etc
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"  // qwerty terms, privacy, dpa, etc
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>


        </div>
      </div>
    </div>

  </div>)
}

function AppIntroduce() {
  return (
    <div className="w-full flex justify-between items-center text-lg font-medium px-8">
      <div className='flex flex-col gap-4 mx-8'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse repellat, non alias autem, iure quos tempora sequi vero error ipsa perferendis aliquam, voluptatibus temporibus id possimus corporis eligendi consectetur laborum.
      </div>
      <Separator
        className='hidden md:fl11ex md:h-[75vh] w-0.5 bg-slate-500'
        orientation='vertical'
      />
    </div>
  )
}
export default LoginPage