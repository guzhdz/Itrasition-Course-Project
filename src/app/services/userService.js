const API_URL = '/api/user';

export const getUser = async (userId) => {
    const messageError = "Unable to log in to your account. Please check your credentials and try again.";
    try {
      const url = new URL(API_URL, window.location.origin);
      url.searchParams.append('action', 'getUser');
      url.searchParams.append('id', userId);
      const response = await fetch(url.toString());
      if (response.status !== 200) {
        return {ok: false, message: messageError};
      } else {
        const data = (await response.json());
        if (data === null) {
            return {ok: false, message: messageError};
        } else
          return {ok: true, data: data};
      }
    } catch (error) {
        console.error('Error in the request:', error);
        return {ok: false, message: messageError};
    }
}

export const insertUser = async ({email, name, password}) => {
    const user = {
        name,
        email,
        password,
        status: true,
        is_admin: false,
        register_time: new Date().toISOString()
    };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        const data = await response.json();
        if (response.status != 200) {
            return { ok: false, message: data.error };
        }
        else {
            return { ok: true };
        }
    } catch (error) {
        console.error('Error in the request:', error);
        return { ok: false, message: 'Something went wrong. Please try again later.' };
    }
}