declare global {
    // Definindo a tipagem para a navegação
    type RootStackParamList = {
      HomePage: undefined;    
      SignInPage: undefined;    
      PostManagementPage: undefined;    
      PostPage: { postId: string | undefined };
      UserPage: undefined;
      ViewPostPage: { id: string, isAdmin?: boolean };
      UserManagementPage: undefined; 
    };
  }
  
  export {};
  