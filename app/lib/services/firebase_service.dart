import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseService {
  static Future<void> initialize() async {
    await Firebase.initializeApp();
  }

  static FirebaseAuth get auth => FirebaseAuth.instance;
  static FirebaseFirestore get firestore => FirebaseFirestore.instance;

  static Future<User?> signInWithEmailAndPassword(
    String email,
    String password,
  ) async {
    final userCredential = await auth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
    return userCredential.user;
  }

  static Future<User?> createUserWithEmailAndPassword(
    String email,
    String password,
  ) async {
    final userCredential = await auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
    return userCredential.user;
  }

  static Future<void> signOut() async {
    await auth.signOut();
  }

  static Stream<User?> authStateChanges() {
    return auth.authStateChanges();
  }

  static Future<DocumentSnapshot> getUserData(String userId) async {
    return await firestore.collection('users').doc(userId).get();
  }

  static Future<void> updateUserData(String userId, Map<String, dynamic> data) async {
    await firestore.collection('users').doc(userId).update(data);
  }

  static Stream<QuerySnapshot> getSignals() {
    return firestore
        .collection('signals')
        .orderBy('timestamp', descending: true)
        .limit(50)
        .snapshots();
  }

  static Stream<QuerySnapshot> getSignalsByPair(String pair) {
    return firestore
        .collection('signals')
        .where('pair', isEqualTo: pair)
        .orderBy('timestamp', descending: true)
        .limit(20)
        .snapshots();
  }
}
