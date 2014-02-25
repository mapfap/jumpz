var checkPlayerPillarCollision = function( playerX, playerY, pillarX, pillarY ) {
  return Math.abs(playerX - pillarX) <= 40 && Math.abs(playerY - pillarY) >= 100;
}