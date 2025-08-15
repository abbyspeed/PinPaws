import '../styles/Copyright.css'

export default function Copyright({ bgColor = '#ffffff' }) {
  const handleNameClick = () => {
    window.open('https://www.linkedin.com/in/wnabihah-dev/', '_blank', 'noopener,noreferrer')
  }

  const isPinkBackground = bgColor === '#ffb6c1'

  return (
    <div className="copyright">
      Developed by{' '}
      <span 
        className={`copyright-name ${isPinkBackground ? 'copyright-name-pink-bg' : ''}`}
        onClick={handleNameClick}
      >
        W Nurnabihah
      </span>{' '}
      for Netizen Experience
    </div>
  )
}
