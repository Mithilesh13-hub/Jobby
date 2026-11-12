import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import EmploymentType from '../EmploymentType'
import SalaryRange from '../SalaryRange'
import Header from '../Header'
import Profile from '../Profile'
import JobsList from '../JobsList'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    employmentTypeIds: [],
    selectedSalaryRangeId: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    jobsList: {},
  }

  componentDidMount() {
    this.getjobsList()
  }

  getjobsList = async () => {
    const {employmentTypeIds, selectedSalaryRangeId, searchInput} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeIds}&minimum_package=${selectedSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = {
          jobs: fetchedData.jobs.map(eachjob => ({
            companyLogoUrl: eachjob.company_logo_url,
            employmentType: eachjob.employment_type,
            id: eachjob.id,
            jobDescription: eachjob.job_description,
            location: eachjob.location,
            packagePerAnnum: eachjob.package_per_annum,
            rating: eachjob.rating,
            title: eachjob.title,
          })),
          total: fetchedData.total,
        }
        this.setState({
          jobsList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onSelectType = event => {
    const {value, checked} = event.target

    this.setState(prevState => {
      if (checked) {
        return {
          employmentTypeIds: [...prevState.employmentTypeIds, value],
        }
      }

      return {
        employmentTypeIds: prevState.employmentTypeIds.filter(
          eachId => eachId !== value,
        ),
      }
    }, this.getjobsList)
  }

  onSelectRange = salaryRangeId => {
    this.setState({selectedSalaryRangeId: salaryRangeId}, this.getjobsList)
  }

  onChangeInputSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getjobsList()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getjobsList()
    }
  }

  typeOfEmployment = () => {
    const {selectedTypeId} = this.state
    return (
      <ul className="employment-list">
        <h1 className="heading">Type of Employment</h1>
        {employmentTypesList.map(eachtype => (
          <EmploymentType
            key={eachtype.employmentTypeId}
            employmentType={eachtype}
            selectedTypeId={selectedTypeId}
            onSelectType={this.onSelectType}
          />
        ))}
      </ul>
    )
  }

  salaryRange = () => {
    const {selectedSalaryRangeId} = this.state

    return (
      <ul className="employment-list">
        <h1 className="heading">Salary Range</h1>
        {salaryRangesList.map(eachRange => (
          <SalaryRange
            key={eachRange.salaryRangeId}
            salaryRangesList={eachRange}
            selectedSalaryRangeId={selectedSalaryRangeId}
            onSelectRange={this.onSelectRange}
          />
        ))}
        <p>{selectedSalaryRangeId}</p>
      </ul>
    )
  }

  pofileAndFilters = () => (
    <div>
      <Profile />
      <br />
      {this.typeOfEmployment()}
      <br />
      {this.salaryRange()}
    </div>
  )

  jobsview = () => {
    const {jobsList} = this.state
    return (
      <div>
        <ul className="jobs-ul">
          {jobsList.jobs.map(eachjob => (
            <JobsList key={eachjob.id} jobDetails={eachjob} />
          ))}
        </ul>
      </div>
    )
  }

  noJobsView = () => (
    <div className="no-jobs-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-para">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  jobListSuccessView = () => {
    const {jobsList} = this.state
    const numOfJobsInList = jobsList.jobs.length > 0
    return (
      <div>
        {numOfJobsInList ? (
          <div>{this.jobsview()}</div>
        ) : (
          <div>{this.noJobsView()}</div>
        )}
      </div>
    )
  }

  loaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button onClick={this.getjobsList} type="button" className="retry-button">
        Retry
      </button>
    </div>
  )

  jobListView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.loaderView()
      case apiStatusConstants.success:
        return this.jobListSuccessView()
      case apiStatusConstants.failure:
        return this.jobFailureView()
      default:
        return null
    }
  }

  searchView = () => {
    const {searchInput} = this.state
    return (
      <div className="search-box">
        <input
          type="search"
          aria-label="search"
          placeholder="Search"
          value={searchInput}
          onChange={this.onChangeInputSearch}
          onKeyDown={this.onEnterSearchInput}
          className="search-input"
        />
        <button
          type="button"
          data-testid="searchButton"
          className="searchButton"
          onClick={this.onClickSearch}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-bg">
          <div className="job-view">
            {this.pofileAndFilters()}
            <div>
              {this.searchView()}
              {this.jobListView()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
