import { motion } from 'framer-motion';
import { benefits } from '../../data/benefits';
import './Benefits.css';

interface Benefit {
  image: string;
  title: string;
  description: string;
}

const Benefits = () => {
  return (
    <section className="benefits-section" id="benefits">
      <div className="benefits-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2>
            Why Choose
            <span className="gradient-text"> LifeGuard</span>
          </h2>
          <p>Experience the advantages of comprehensive health monitoring</p>
        </motion.div>

        <div className="benefits-grid">
          {benefits.map((benefit: Benefit, index: number) => (
            <motion.div
              key={index}
              className="benefit-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="benefit-image-container">
                <motion.img
                  src={benefit.image}
                  alt={benefit.title}
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
                <div className="image-backdrop" />
              </div>
              <div className="benefit-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
