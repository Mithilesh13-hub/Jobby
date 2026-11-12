import {Link} from 'react-router-dom'
import {IoStar, IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobsList = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <li className="jobview-list">
      <Link to={`/jobs/${id}`}>
        <div>
          <div className="flex-raw">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div>
              <h1 className="company-heading">{title}</h1>
              <div className="icon-text">
                <IoStar className="star" />
                <p className="text">{rating}</p>
              </div>
            </div>
          </div>

          <div className="comapny-loc-sal">
            <div className="icon-text">
              <IoLocationSharp className="icon" />
              <p className="text">{location}</p>
            </div>

            <div className="icon-text">
              <BsFillBriefcaseFill className="icon" />
              <p className="text">{employmentType}</p>
            </div>
            <div className="space-btw">
              <p className="salary">{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div>
            <h1 className="company-heading">Description</h1>
            <p className="description">{jobDescription}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}
export default JobsList
