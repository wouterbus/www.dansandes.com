import LogoGrid, {LogoItem} from './LogoGrid'

type LogoGridSectionProps = {
  logos?: LogoItem[]
}

export default function LogoGridSection({logos}: LogoGridSectionProps) {
  return (
    <section className="section logos" aria-label="Marcas e parceiros">
      <div className="section__particles logos__particles" aria-hidden="true">
        <div className="section__decor logos__decor--red" />
        <div className="section__decor logos__decor--orange" />
        <div className="section__decor logos__decor--purple" />
        <div className="section__decor logos__decor--yellow" />
      </div>

      <div className="logos__inner site-container">
        <LogoGrid logos={logos} />
      </div>
    </section>
  )
}
