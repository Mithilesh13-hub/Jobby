import './index.css'

const SalaryRange = props => {
  const {salaryRangesList, selectedSalaryRangeId, onSelectRange} = props
  const {salaryRangeId, label} = salaryRangesList

  const onClickinput = () => {
    onSelectRange(salaryRangeId)
  }

  return (
    <li className="label-item">
      <label className="label-name">
        <input
          type="radio"
          value={label}
          checked={selectedSalaryRangeId === salaryRangeId}
          onChange={onClickinput}
        />
        {label}
      </label>
    </li>
  )
}
export default SalaryRange
