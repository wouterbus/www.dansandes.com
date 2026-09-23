import LogoGrid, {LogoItem} from './LogoGrid'
import ScrollParticles from './ScrollParticles'
import {LOGOS_PARTICLES} from '../lib/particleConfigs'

type LogoGridSectionProps = {
  logos?: LogoItem[]
}

export default function LogoGridSection({logos}: LogoGridSectionProps) {
  return (
    <section className="section logos" aria-label="Marcas e parceiros">
      <ScrollParticles className="section__particles logos__particles" particles={LOGOS_PARTICLES} />

      <div className="logos__inner site-container">
        <LogoGrid logos={logos} />
      </div>
    </section>
  )
}
