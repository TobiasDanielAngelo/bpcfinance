import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { isWideScreen } from "../constants/constants";
import { PaginatedDetails } from "../constants/interfaces";

export type MyPageBarProps = {
  pageDetails?: PaginatedDetails;
  onPressNext: () => void;
  onPressPrev: () => void;
  onPressPage: (page: number) => void;
  title: string;
};

export const MyPageBar: React.FC<MyPageBarProps> = ({
  pageDetails,
  onPressNext,
  onPressPrev,
  onPressPage,
  title,
}) => {
  if (!pageDetails) return <></>;
  const { currentPage, totalPages, count } = pageDetails;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);
      if (left > 2) pages.push("...");

      for (let i = left; i <= right; i++) pages.push(i);

      if (right < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <View
      style={[
        styles.main,
        {
          flexDirection:
            Dimensions.get("window").width > 600 ? "row" : "column",
        },
      ]}
    >
      <View>
        <Text>{`Page ${currentPage} of ${totalPages} (${count} items)`}</Text>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>
      <View style={styles.pageNav}>
        {currentPage === 1 ? (
          <></>
        ) : (
          <Pressable style={[styles.navButton, styles.navLeft]}>
            <Text style={styles.text} onPress={onPressPrev}>
              {`\u276e`}
            </Text>
          </Pressable>
        )}
        {totalPages <= 1 ? (
          <></>
        ) : (
          getPageNumbers().map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.navButton,
                item === currentPage ? styles.selected : {},
              ]}
              onPress={
                typeof item === "number" ? () => onPressPage(item) : undefined
              }
            >
              <Text
                style={[
                  styles.text,
                  item === currentPage ? styles.selected : {},
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))
        )}
        {currentPage < totalPages && (
          <Pressable style={[styles.navButton, styles.navRight]}>
            <Text style={styles.text} onPress={onPressNext}>
              {`\u276f`}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    padding: 10,
    alignItems: "center",
    flexDirection: isWideScreen ? "row" : "column",
    // flexWrap: "wrap",
    justifyContent: "space-between",
    margin: 4,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  pageNav: {
    flexDirection: "row",
    gap: 2,
  },
  navButton: {
    padding: 1,
    paddingHorizontal: 7,
    backgroundColor: "lightcyan",
    minWidth: 20,
    textAlign: "center",
    alignItems: "center",
  },
  navLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  navRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  selected: {
    backgroundColor: "teal",
    color: "white",
  },
  text: {
    fontSize: 15,
  },
});
