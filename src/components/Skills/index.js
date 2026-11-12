import './index.css'

const Skills = props => {
  const {skill} = props
  const {imageUrl, name} = skill
  return (
    <li className="skill-card">
      <img src={imageUrl} alt={name} />
      <p className="skill-heading">{name}</p>
    </li>
  )
}
export default Skills
