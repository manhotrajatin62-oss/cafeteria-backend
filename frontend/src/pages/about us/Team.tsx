import team_image from "../../assets/team.png"

const Team = () => {
  return (
    <section className="flex justify-center h-[calc(100dvh-8.75rem)] w-250 mx-auto items-center gap-6">
        <img draggable="false" src={team_image} className="w-120" alt="team-image" />

        <div>
            <h1 className="text-4xl font-bold">Meet Our Team</h1>
            <p className="text-justify mt-4">Meet our team of culinary experts, dedicated to turning every meal into a delightful experience. From our skilled chefs who bring creativity to each dish, to our friendly servers who ensure your dining journey is seamless, we take pride in the passion and expertise that defines our team. Together, we strive to create a welcoming atmosphere where delicious flavors and warm hospitality converge.</p>
        </div>
    </section>
  )
}

export default Team