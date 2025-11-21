const canvas = document.getElementById('starCanvas')
const ctx = canvas.getContext('2d')

let width, height
let stars = []
let particles = []
const numStars = 1000

let baseSpeed = 3
let warpSpeed = 50
let currentSpeed = baseSpeed
let isWarping = false

function resize() {
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width
  canvas.height = height
  ctx.translate(width / 2, height / 2)
}

class Star {
  constructor() {
    this.reset()
  }
  reset() {
    this.x = (Math.random() - 0.5) * width * 2
    this.y = (Math.random() - 0.5) * height * 2
    this.z = Math.random() * width
    this.pz = this.z
  }
  update() {
    this.z -= currentSpeed
    if (this.z < 1) {
      this.reset()
      this.z = width
      this.pz = this.z
    }
  }
  draw() {
    const sx = (this.x / this.z) * width
    const sy = (this.y / this.z) * height
    const px = (this.x / this.pz) * width
    const py = (this.y / this.pz) * height
    this.pz = this.z
    if (Math.abs(sx) > width / 2 || Math.abs(sy) > height / 2) return
    const r = (1 - this.z / width) * 4
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(px, py)
    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - this.z / width})`
    ctx.lineWidth = isWarping ? r * 1.5 : r
    ctx.stroke()
  }
}

class Particle {
  constructor(x, y) {
    this.x = x - width / 2
    this.y = y - height / 2
    this.size = Math.random() * 3 + 1
    this.speedX = Math.random() * 2 - 1
    this.speedY = Math.random() * 2 - 1
    this.color =
      Math.random() > 0.5 ? 'rgba(0, 243, 255, ' : 'rgba(188, 19, 254, '
    this.alpha = 1
  }
  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.alpha -= 0.02
  }
  draw() {
    if (this.alpha > 0) {
      ctx.fillStyle = this.color + this.alpha + ')'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function init() {
  resize()
  stars = []
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star())
  }
  animate()
}

function animate() {
  ctx.fillStyle = isWarping ? 'rgba(5, 7, 20, 0.1)' : 'rgba(5, 7, 20, 0.3)'
  ctx.fillRect(-width / 2, -height / 2, width, height)
  stars.forEach((star) => {
    star.update()
    star.draw()
  })
  for (let i = 0; i < particles.length; i++) {
    particles[i].update()
    particles[i].draw()
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1)
      i--
    }
  }
  let target = isWarping ? warpSpeed : baseSpeed
  currentSpeed += (target - currentSpeed) * 0.05
  requestAnimationFrame(animate)
}

window.addEventListener('resize', resize)
window.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 3; i++) {
    particles.push(new Particle(e.clientX, e.clientY))
  }
})

const warpBtn = document.getElementById('warpBtn')
const body = document.body
warpBtn.addEventListener('click', () => {
  if (isWarping) return
  isWarping = true
  warpBtn.textContent = 'INITIATING HYPERDRIVE...'
  body.classList.add('warp-shake')
  setTimeout(() => {
    isWarping = false
    warpBtn.textContent = 'FLY TO OMEGA VESPERA'
    body.classList.remove('warp-shake')
    document.getElementById('pricing').scrollIntoView()
  }, 3000)
})

init()

const modal = document.getElementById('bookingModal')
const modalContent = document.getElementById('modalContent')
const packageLabel = document.getElementById('selectedPackage')

function openModal(packageName) {
  modal.classList.remove('hidden')
  packageLabel.textContent = packageName
  setTimeout(() => {
    modalContent.classList.remove('scale-95', 'opacity-0')
    modalContent.classList.add('scale-100', 'opacity-100')
  }, 10)
}

function closeModal() {
  modalContent.classList.remove('scale-100', 'opacity-100')
  modalContent.classList.add('scale-95', 'opacity-0')
  setTimeout(() => {
    modal.classList.add('hidden')
  }, 300)
}

function handleBookingSubmit(e) {
  e.preventDefault()
  closeModal()
  showToast('Transmission Confirmed! Your ticket is being minted.')
}

function showToast(message) {
  const toast = document.getElementById('toast')
  const toastMsg = document.getElementById('toastMessage')

  toastMsg.textContent = message
  toast.classList.remove('translate-y-24', 'opacity-0')

  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0')
  }, 4000)
}

function handleNewsletter() {
  const input = document.getElementById('footerEmail')
  if (input.value.includes('@')) {
    showToast('Welcome to the fleet, Cadet.')
    input.value = ''
  } else {
    alert('Please enter a valid Interstellar ID.')
  }
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal()
})
