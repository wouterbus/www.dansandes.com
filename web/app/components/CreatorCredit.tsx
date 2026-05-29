import {SERIGUELA_URL, STUDIO_W_URL} from '../lib/creatorLinks'

type CreatorCreditProps = {
  className?: string
}

export default function CreatorCredit({className}: CreatorCreditProps) {
  return (
    <p className={className ? `creator-credit ${className}` : 'creator-credit'}>
      Criado por{' '}
      <a
        href={SERIGUELA_URL}
        className="creator-credit__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>Seriguela</strong>
      </a>
      {' & '}
      <a
        href={STUDIO_W_URL}
        className="creator-credit__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>Studio W</strong>
      </a>
    </p>
  )
}
