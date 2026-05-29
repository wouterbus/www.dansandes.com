import CaseStudy, {type CaseStudyData} from './CaseStudy'
import CasesLoadMore from './CasesLoadMore'

type CasesSectionProps = {
  cases?: CaseStudyData[]
}

export default function CasesSection({cases}: CasesSectionProps) {
  if (!cases?.length) {
    return (
      <section id="cases" className="section cases-section" aria-label="Cases">
        <div className="site-container">
          <p className="cases-section__empty">
            Adicione cases em Sanity → <strong>Cases</strong> (não “Cases legacy carousel”).
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="cases" className="section cases-section" aria-label="Cases">
      <div className="cases-section__list site-container">
        <CasesLoadMore>
          {cases.map((item, index) => (
            <CaseStudy key={item._key ?? `case-${index}`} caseStudy={item} />
          ))}
        </CasesLoadMore>
      </div>
    </section>
  )
}
