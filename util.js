import { 
  ANILIST_APP_ID, 
  ANILIST_AUTH_URL, 
  ANILIST_APP_SECRET, 
  ANILIST_TOKEN_URL 
} from 'react-native-dotenv';

import { AuthSession } from 'expo';

import {
  AsyncStorage,
} from 'react-native';

export const login = async () => {
  const response = await AuthSession.startAsync({
    authUrl:`${ANILIST_AUTH_URL}?response_type=code`+
    `&client_id=${ANILIST_APP_ID}` +
    `&redirect_uri:${AuthSession.getRedirectUrl()}`
  });
  const { type, errorCode = 'You cancel or dismissed the login', params } = response;

  if (type === 'success') {
    // Just simple way to store the token in this examples
    // 
    const code = params.code;
    const credentials = await getAccessToken(code);
    // token_type, expires_in, access_token, refresh_token (code) 
    return  {
      ok: true,
      ...credentials 
    };
  } else {
    /**
     * Result types can be: cancel, dismissed or error (with errorCode)
     */
    return {
      ok: false,
      type,
      errorCode,
    }
  }
}

export const getAccessToken = async (code, refresh = false) =>  {
  // console.log(code)
  // for (var i = 0; i < code.length; i++) { console.log(i, code.charAt(i), code.charCodeAt(i)); }
  const grantType = !refresh ?  "authorization_code" : "refresh_token"
  const refresh_token = code;
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "grant_type": grantType,
        "client_id": ANILIST_APP_ID,
        "client_secret": ANILIST_APP_SECRET,
        "redirect_uri": AuthSession.getRedirectUrl(), 
        code,
        refresh_token
      })
    };

    const url = "https://anilist.co/api/v2/oauth/token";
    const response = await fetch(url, options);
    const data = await handleResponse(response)
    await handleData(data)

    return data;
  } catch (error) {
    handleError(error)
  }
}

export const logout = async () => {
  await AsyncStorage.removeItem('credentials');
} 


handleResponse = async (response) => {
  const json = await response.json()
  return response.ok ? json : Promise.reject(json);
}

handleData = async (data) => {
  // console.log(data);
  await AsyncStorage.setItem('credentials', JSON.stringify(data));
}

handleError = (error) => {
  alert('Error, check console');
  console.error(error);
}
