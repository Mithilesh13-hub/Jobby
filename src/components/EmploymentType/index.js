import './index.css'

const EmploymentType = props => {
  const {employmentType, onSelectType} = props
  const {label, employmentTypeId} = employmentType
  const onClickinput = event => {
    onSelectType(event)
  }

  return (
    <li className="label-item">
      <label className="label-name">
        <input
          type="checkbox"
          value={employmentTypeId}
          onChange={onClickinput}
        />
        {label}
      </label>
    </li>
  )
}
export default EmploymentType
