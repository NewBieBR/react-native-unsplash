import axios from 'axios';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  ModalProps,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

const LightGray = '#f5f6fa';

export interface UnsplashSearchProps {
  style?: any;
  accessKey: string;
  photosPerPage?: number;
  initialSearchInput?: string;

  modal?: boolean;
  modalProps?: Partial<ModalProps>;

  headerRightComponent?: () => React.ReactChild;
  headerLeftComponent?: () => React.ReactChild;
  titleLabelStyle?: any;
  titleLabel: string;
  // follow by 'by Unsplash' is required
  // https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines

  searchBarStyle?: any;
  searchInputProps?: Partial<TextInputProps>;
  searchIconComponent?: () => React.ReactChild;

  //   photosListComponent?: React.ComponentClass<any, any>;
  //   photosListComponentProps?: any;
  imageComponent?: React.ComponentClass<any, any>;
  imageComponentProps?: any;
  photoContainerStyle?: any;
  onPhotoSelect?: (photo: UnsplashPhoto) => void;
  photoMode: 'raw' | 'full' | 'regular' | 'small' | 'thumb';
  renderPhotosList?: (photos: UnsplashPhoto[]) => React.ReactNode;
  queryAfterInput?: number; // ms
}

export interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  promoted_at: string;
  width: number;
  height: number;
  color: string;
  description: string;
  alt_description: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  categories: any[];
  likes: number;
  liked_by_user: boolean;
  current_user_collections: [];
  user: {
    id: string;
    username: string;
    name: string;
    profile_image: { small: string; medium: string; large: string };
  };
  tags: any[];
}

export interface UnsplashSearchState {
  photos: UnsplashPhoto[];
  query: string;
  currentPage: number;
  querying: boolean;
}

export default class UnsplashSearch extends React.Component<
  UnsplashSearchProps,
  UnsplashSearchState
> {
  public static defaultProps = {
    titleLabel: 'Photos by Unsplash',
    searchInputProps: { placeholder: 'Search...' },
    photosPerPage: 20,
    photoMode: 'regular',
    queryAfterInput: 250,
  };

  queryTimeOut: any;

  constructor(props: UnsplashSearchProps) {
    super(props);
    this.state = {
      photos: [],
      query: '',
      currentPage: 1,
      querying: false,
    };
    this.onChangeText = this.onChangeText.bind(this);
  }

  componentDidMount() {
    if (this.props.initialSearchInput) {
      this.queryPhotos(this.props.initialSearchInput);
    }
  }

  async queryPhotos(query: string, page: number = 1) {
    this.setState({ querying: page === 1 });
    const { accessKey, photosPerPage } = this.props;
    const url = `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${query}&page=${page}&per_page=${photosPerPage}`;
    const res = await axios.get(url);
    if (page === 1) {
      this.setState({ photos: res.data.results, querying: false });
      return;
    }
    const newPhotos = this.state.photos.concat(res.data.results);
    const result = [];
    const map = new Map();
    for (const item of newPhotos) {
      if (!map.has(item.id)) {
        map.set(item.id, true); // set any value to Map
        result.push({
          ...item,
          id: item.id,
        });
      }
    }
    this.setState({ photos: result, querying: false });
  }

  renderHeader() {
    const {
      titleLabel,
      titleLabelStyle,
      headerLeftComponent,
      headerRightComponent,
    } = this.props;
    const hasSideComponent =
      headerLeftComponent !== undefined || headerRightComponent !== undefined;
    return (
      <SafeAreaView>
        <View style={styles.header}>
          {hasSideComponent && (
            <View style={styles.sideCont}>
              {headerLeftComponent && headerLeftComponent()}
            </View>
          )}
          <View style={styles.titleCont}>
            <Text style={[styles.title, titleLabelStyle]}>{titleLabel}</Text>
          </View>
          {hasSideComponent && (
            <View style={styles.sideCont}>
              {headerRightComponent && headerRightComponent()}
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  onChangeText(query: string) {
    this.setState({ query, currentPage: 1 });
    clearTimeout(this.queryTimeOut);
    this.queryTimeOut = setTimeout(() => {
      this.queryPhotos(query);
    }, this.props.queryAfterInput);
  }

  renderSearchBar() {
    const { query } = this.state;
    const {
      searchBarStyle,
      searchInputProps,
      searchIconComponent,
    } = this.props;
    return (
      <View style={styles.searchBarCont}>
        <View style={[styles.searchBar, searchBarStyle]}>
          {searchIconComponent && (
            <View style={[styles.searchSideComponent]}>
              {searchIconComponent()}
            </View>
          )}
          <TextInput
            clearButtonMode="always"
            value={query}
            onChangeText={this.onChangeText}
            returnKeyType="search"
            {...searchInputProps}
            style={[
              styles.searchBarInput,
              searchInputProps && searchInputProps.style,
            ]}
          />
        </View>
      </View>
    );
  }

  renderPhotosList() {
    const {
      onPhotoSelect,
      imageComponentProps,
      photoContainerStyle,
      photoMode,
      renderPhotosList,
      //   photosListComponentProps,
    } = this.props;
    const ImageComponent = this.props.imageComponent || Image;
    // const PhotosListComponent = this.props.photosListComponent || FlatList;
    if (this.state.querying) {
      return (
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={styles.flexCenter}
        >
          <ActivityIndicator />
        </KeyboardAvoidingView>
      );
    }
    if (renderPhotosList) return renderPhotosList(this.state.photos);
    return (
      <FlatList
        style={styles.photosListCont}
        data={this.state.photos}
        keyExtractor={photo => photo.id}
        renderItem={({ item: photo }) => {
          return (
            <TouchableOpacity
              style={[styles.photoTouchable, photoContainerStyle]}
              activeOpacity={0.8}
              onPress={() => {
                if (onPhotoSelect) onPhotoSelect(photo);
              }}
            >
              <ImageComponent
                style={styles.photo}
                source={{ uri: photo.urls[photoMode] }}
                resizeMode="cover"
                {...imageComponentProps}
              />
              <View style={styles.authorNameCont}>
                <Text style={styles.authorName}>{photo.user.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        // {...photosListComponentProps}
      />
    );
  }

  renderView() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderHeader()}
        {this.renderSearchBar()}
        {this.renderPhotosList()}
      </View>
    );
  }

  public render() {
    const { modalProps, modal } = this.props;
    if (!modal) return this.renderView();
    return (
      <Modal animationType="slide" transparent {...modalProps}>
        {this.renderView()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 42,
    flexDirection: 'row',
  },
  titleCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideCont: {
    width: 70,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchBarCont: {
    height: 64,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: LightGray,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  searchBarInput: {
    fontSize: 14,
    paddingHorizontal: 8,
    flex: 1,
    paddingVertical: 10,
  },
  searchSideComponent: {},
  photosListCont: {
    flex: 1,
    paddingHorizontal: 20,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoTouchable: {
    flex: 1,
    width: '100%',
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  authorNameCont: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 5,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '300',
    color: 'white',
  },
});
