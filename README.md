# react-native-unsplash

Online photos gallery search using Unplash

<img src="https://raw.github.com/NewBieBR/react-native-unsplash/master/assets/demo.gif" height=400>

## Installation

1. [Register](https://unsplash.com/developers) you developer account for Unsplash API

2. [Create](https://unsplash.com/oauth/applications) a new app on Unsplash

3. Go to the **Keys** section of your app's page and copy your keys into a new file.
```typescript
const UnsplashKeys = {
  accessKey: '...',
  secretKey: '...',
};

export default UnsplashKeys;
```
> Remeber to keep this file in local

4. Install this package
```bash
yarn add react-native-unsplash
```

## Basic Usage

```tsx
import UnsplashSearch, { UnsplashPhoto } from 'react-native-unsplash';

onOnlinePhotoSelect(photo: UnsplashPhoto) {
    console.log(photo.urls.regular)
}

render() {
  return <UnsplashSearch
    accessKey={...} 
    onPhotoSelect={this.onOnlinePhotoSelect
  />;
}
```
