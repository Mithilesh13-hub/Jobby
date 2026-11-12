import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import {IoStar, IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiExternalLink} from 'react-icons/hi'

import Header from '../Header'
import Skills from '../Skills'
import SimilarJob from '../SimilarJob'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {jobdetailslist: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getjobDetailsList()
  }

  getjobDetailsList = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok === true) {
        const fetchedData = await response.json()
        const updatedData = {
          jobDetails: fetchedData.job_details,
          companyLogoUrl: fetchedData.job_details.company_logo_url,
          companyWebsiteUrl: fetchedData.job_details.company_website_url,
          employmentType: fetchedData.job_details.employment_type,
          id: fetchedData.job_details.id,
          jobDescription: fetchedData.job_details.job_description,
          skills: fetchedData.job_details.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          lifeAtCompany: fetchedData.job_details.life_at_company,
          description: fetchedData.job_details.life_at_company.description,
          imageUrl: fetchedData.job_details.life_at_company.image_url,
          location: fetchedData.job_details.location,
          packagePerAnnum: fetchedData.job_details.package_per_annum,
          rating: fetchedData.job_details.rating,
          title: fetchedData.job_details.title,
          similarJobs: fetchedData.similar_jobs.map(eachjob => ({
            companyLogoUrl: eachjob.company_logo_url,
            employmentType: eachjob.employment_type,
            id: eachjob.id,
            jobDescription: eachjob.job_description,
            location: eachjob.location,
            rating: eachjob.rating,
            title: eachjob.title,
          })),
        }
        this.setState({
          jobdetailslist: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsView = () => {
    const {jobdetailslist} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      description,
      imageUrl,
      location,
      packagePerAnnum,
      rating,
      similarJobs,
      title,
    } = jobdetailslist
    return (
      <div>
        <div className="life-at-company-bg">
          <div className="flex-raw">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
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
          <br />
          <div>
            <div className="job-details-link">
              <h1 className="company-heading">Description</h1>
              <a
                href={companyWebsiteUrl}
                className="link"
                to={companyWebsiteUrl}
              >
                Visit <HiExternalLink />
              </a>
            </div>
            <p className="description">{jobDescription}</p>
          </div>
          <div>
            <h1 className="company-heading">Skills</h1>
            <ul className="skill-ul">
              {skills.map(eachSkill => (
                <Skills key={eachSkill.name} skill={eachSkill} />
              ))}
            </ul>
          </div>
          <div>
            <h1 className="company-heading">Life at Company</h1>
            <div className="flex-raw">
              <p className="life-at-company-description">{description}</p>
              <img
                className="life-at-company-image"
                src={imageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div>
          <h1 className="life-at-company-company-heading">Similar Jobs</h1>
          <ul className="flex-raw">
            {similarJobs.map(eachjob => (
              <SimilarJob key={eachjob.id} similarjob={eachjob} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        onClick={this.getjobDetailsList}
        type="button"
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-details-bg">{this.renderView()}</div>
      </div>
    )
  }
}

export default JobItemDetails
