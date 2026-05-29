import localFont from 'next/font/local'
import {Montserrat} from 'next/font/google'

export const nomos = localFont({
  src: [
    {path: '../public/Nomos/NomosSans-Thin.otf', weight: '100', style: 'normal'},
    {path: '../public/Nomos/NomosSans-ExtraLight.otf', weight: '200', style: 'normal'},
    {path: '../public/Nomos/NomosSans-Light.otf', weight: '300', style: 'normal'},
    {path: '../public/Nomos/NomosSans-Regular.otf', weight: '400', style: 'normal'},
    {path: '../public/Nomos/NomosSans-Medium.otf', weight: '500', style: 'normal'},
    {path: '../public/Nomos/NomosSans-SemiBold.otf', weight: '600', style: 'normal'},
    {path: '../public/Nomos/NomosSans-Bold.otf', weight: '700', style: 'normal'},
    {path: '../public/Nomos/NomosSans-ExtraBold.otf', weight: '800', style: 'normal'},
    {path: '../public/Nomos/NomosSans-Black.otf', weight: '900', style: 'normal'},
  ],
  variable: '--font-title',
  display: 'swap',
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})
