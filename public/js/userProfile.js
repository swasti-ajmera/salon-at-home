document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateUserForm');
    
    async function loadUserDetails() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            M.toast({html: 'User ID not found'});
            return;
        }

        try {
            const response = await fetch(`/api/user/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const userData = await response.json();
            console.log(userData);
            
            document.getElementById('name').value = userData.name || '';
            document.getElementById('email').value = userData.email || '';
            
            M.updateTextFields();
        } catch (error) {
            console.error('Failed to load user details:', error);
            M.toast({html: 'Failed to load user details'});
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        if (!userId) {
            M.toast({html: 'User ID not found'});
            return;
        }
        
        // Create a JSON object instead of FormData
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };

        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'  // Specify JSON content type
                },
                body: JSON.stringify(userData)  // Convert data to JSON string
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            M.toast({html: 'Profile updated successfully'});
            setTimeout(() => window.location.href = '/main.html', 1500);
        } catch (error) {
            console.error('Failed to update profile:', error);
            M.toast({html: error.message || 'Failed to update profile'});
        }
    });

    loadUserDetails();
});