// JavaScript para futuras funcionalidades interactivas de OctoArch
console.log("OctoArch v4.0 Web está cargada y lista para la acción.");

// Ejemplo: Smooth scrolling para los enlaces de navegación
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
