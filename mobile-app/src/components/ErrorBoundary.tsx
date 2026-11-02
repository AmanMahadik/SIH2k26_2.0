import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('ErrorBoundary caught error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>
            {this.props.fallbackTitle || 'Display Module Unavailable'}
          </Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'Component failed to render safely.'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={this.resetError} activeOpacity={0.8}>
            <Text style={styles.retryText}>🔄 Retry View</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 2,
  },
  errorMessage: {
    fontSize: 10,
    color: '#7F1D1D',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#DC2626',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
