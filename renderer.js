const button = document.getElementById('btn')
const answerTextarea = document.getElementById('answer')
const questionElement = document.getElementById('question')

button.addEventListener('click', async () => {
    const notes = answerTextarea.value.trim()
    
    if (!notes) {
        alert('Please enter some notes first!')
        return
    }

    // Disable button during processing
    button.disabled = true
    button.textContent = 'Generating Question...'
    questionElement.textContent = 'Thinking...'
    
    try {
        const question = await window.api.generateQuestion(notes)
        questionElement.innerHTML = question.replace(/\n/g, '<br>')
        answerTextarea.value = '' // Clear input after generation
    } catch (error) {
        console.error('Error:', error)
        questionElement.textContent = '❌ Error generating question. Please try again.'
    }
    
    // Reset button
    button.disabled = false
    button.textContent = 'Generate Question'
})