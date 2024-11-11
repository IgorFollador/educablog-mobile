import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View style={styles.paginationContainer}>
      {pages.map((page) => (
        <TouchableOpacity
          key={page}
          onPress={() => onPageChange(page)}
          style={[
            styles.pageButton,
            page === currentPage ? styles.activePageButton : styles.inactivePageButton,
          ]}
        >
          <Text style={page === currentPage ? styles.activePageText : styles.inactivePageText}>
            {page}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activePageButton: {
    backgroundColor: '#3b82f6',
  },
  inactivePageButton: {
    backgroundColor: '#e5e7eb',
  },
  activePageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  inactivePageText: {
    color: '#000000',
    fontSize: 16,
  },
});

export default Pagination;
