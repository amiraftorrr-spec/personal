export default function Particles() {

  return (

    <div className="absolute inset-0 overflow-hidden">

      {[...Array(25)].map((_,i)=>(

        <div

          key={i}

          className="particle"

          style={{

            left:`${Math.random()*100}%`,

            animationDelay:`${i*0.3}s`

          }}

        />

      ))}

    </div>

  )

}