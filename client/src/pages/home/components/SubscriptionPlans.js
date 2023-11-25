import { FaBusinessTime, FaUserTie, FaUser } from 'react-icons/fa';
import './SubscriptionPlans.css';
import { Link } from 'react-router-dom';

const PlanCard = ({ plan, index }) => (
  <div className={`plan-card ${index === 0 ? 'first-card' : ''}`}>
    <div className="card-content">
      <div className={`plan-name ${index === 0 ? 'first-card-name' : ''}`}>{plan.name}</div>
      <div className='plan-icon'>
        {plan.icon}
      </div>
      <ul className="plan-features">
        {plan.features.map((feature, i) => (
          <li key={i} className={`feature ${index === 0 ? 'first-card-feature' : ''}`}>{feature}</li>
        ))}
      </ul>
    </div>
    <Link to="http://localhost:3000/register" className={`register-button ${index === 0 ? 'register-button-first-card' : ''}`}>Register</Link >
  </div>
);

const SubscriptionPlans = () => {
  const plans = [
    {
      name: 'Business Plan',
      description: '6-10 professionals, customer database unlimited, appointment reminders, agenda, business administration functions, WhatsApp integration.',
      features: ['6-10 professionals', 'Unlimited customers', 'Agenda', 'Business admin', 'WhatsApp integration', 'Appointment reminders'],
      icon: <FaBusinessTime size={60}/>
    },
    {
        name: 'Professional Plan',
        description: '2-5 professionals, until 600 costumers allowed in the database, agenda, business administration functions, WhatsApp integration.',
        features: ['2-5 professionals', '600 customers', 'Agenda', 'Business admin', 'WhatsApp integration'],
        icon: <FaUserTie size={60}/>
      },
      {
        name: 'Personal Plan',
        description: '1 professional, until 250 customers allowed in the database, agenda, business administration functions',
        features: ['1 professional', '250 customers', 'Agenda', 'Business admin'],
        icon: <FaUser size={60}/>
      },
  ];
  

  return (
    <div className="plans-container">
      {plans.map((plan, index) => (
        <PlanCard key={index} plan={plan} index={index} />
      ))}
    </div>
  );
};

export default SubscriptionPlans;






const plans = [
  {
    name: 'Business Plan',
    description: '6-10 professionals, customer database unlimited, appointment reminders, agenda, business administration functions, WhatsApp integration.',
    features: ['6-10 professionals', 'Unlimited customers', 'Agenda', 'Business admin', 'WhatsApp integration', 'Appointment reminders'],
    icon: <FaBusinessTime size={60}/>
  },
  {
      name: 'Professional Plan',
      description: '2-5 professionals, until 600 costumers allowed in the database, agenda, business administration functions, WhatsApp integration.',
      features: ['2-5 professionals', '600 customers', 'Agenda', 'Business admin', 'WhatsApp integration'],
      icon: <FaUserTie size={60}/>
    },
    {
      name: 'Personal Plan',
      description: '1 professional, until 250 customers allowed in the database, agenda, business administration functions',
      features: ['1 professional', '250 customers', 'Agenda', 'Business admin'],
      icon: <FaUser size={60}/>
    },
];
