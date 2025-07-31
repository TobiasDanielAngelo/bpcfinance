import { observer } from "mobx-react-lite";
import { FlatList, Text, View } from "react-native";
import { useNavigate } from "react-router-native";
import { useStore } from "../api/Store";
import { titleToCamel, toTitleCase } from "../constants/helpers";
import { Page, StateSetter } from "../constants/interfaces";
import MyDrawer from "./MyDrawer";
import { ImageNameType, MyImage } from "./MyImages";

const drawerWidth = 240;

export const ResponsiveDrawer = observer(
  (props: {
    open: boolean;
    setOpen: StateSetter<boolean>;
    paths?: Page[];
    onPress: () => void;
  }) => {
    const { open, setOpen, paths } = props;
    const navigate = useNavigate();
    return (
      <MyDrawer isOpen={open} onClose={() => setOpen?.(false)}>
        <FlatList
          data={paths}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item: s }) => {
            const onPress = () => {
              if (s.onPress) {
                s.onPress();
              } else {
                navigate(s.link ?? "#");
              }
              setOpen?.(false);
            };
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <MyImage
                  image={titleToCamel(s.title) as ImageNameType}
                  onPress={onPress}
                />
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 18,
                    marginHorizontal: 5,
                    flexShrink: 1,
                    fontWeight: "bold",
                  }}
                  onPress={onPress}
                >
                  {toTitleCase(s.title)}
                </Text>
              </View>
            );
          }}
        />
      </MyDrawer>
    );
  }
);

export const MyNavBar = observer(
  (props: {
    title?: string;
    profileUrl?: string;
    paths?: Page[];
    drawerOpen: boolean;
    setDrawerOpen: StateSetter<boolean>;
  }) => {
    const { title, profileUrl, paths, drawerOpen, setDrawerOpen } = props;

    const {} = useStore();
    const navigate = useNavigate();

    const onPressLogout = async () => {
      navigate("/login");
    };

    const leafPages = paths?.flatMap((p) => {
      const leaves = p.children?.length
        ? p.children.filter((c) => !c.children?.length)
        : [];

      if (p.link) {
        leaves.push({
          title: p.title,
          link: p.link,
        });
      }
      return leaves.length ? leaves : [p];
    });

    const onPress = () => {
      setDrawerOpen(true);
    };

    return (
      <ResponsiveDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        paths={[
          ...(leafPages ?? []),
          {
            title: "Logout",
            link: "",
            onPress: onPressLogout,
          },
        ]}
        onPress={onPress}
      />
    );
  }
);
